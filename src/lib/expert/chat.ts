import Anthropic from '@anthropic-ai/sdk'
import type { Payload } from 'payload'

import { buildSystemPrompt } from './knowledge'
import { expertTools, runTool, TOOL_STATUS, type ToolOutcome } from './tools'

type BetaMessageParam = Anthropic.Beta.BetaMessageParam
type BetaContentBlock = Anthropic.Beta.BetaContentBlock

export const MODEL = process.env.EXPERT_MODEL || 'claude-opus-5-5'
const EFFORT = (process.env.EXPERT_EFFORT || 'low') as 'low' | 'medium' | 'high'
/** Tool round-trips allowed for one visitor message. */
const MAX_STEPS = 6
export const MAX_TURNS = 40
export const MAX_MESSAGE_LENGTH = 2000

export type TranscriptLine = { role: 'visitor' | 'expert'; text: string }

/** What the browser receives, one JSON object per server-sent event. */
export type ChatEvent =
  | { type: 'text'; text: string }
  | { type: 'status'; text: string }
  | NonNullable<ToolOutcome['event']>
  | { type: 'done' }
  | { type: 'error'; message: string }

// The knowledge block changes only when staff edit content; rebuilding it every few minutes
// keeps it identical between requests so the prompt cache is reused.
let systemCache: { key: string; text: string; at: number } | null = null
const SYSTEM_TTL = 5 * 60_000

async function systemPrompt(payload: Payload, showPrices: boolean) {
  const key = String(showPrices)
  if (systemCache && systemCache.key === key && Date.now() - systemCache.at < SYSTEM_TTL) return systemCache.text
  const text = await buildSystemPrompt(payload, showPrices)
  systemCache = { key, text, at: Date.now() }
  return text
}

/**
 * After a mid-output model fallback, blocks before the last `fallback` marker other than text
 * must not be echoed back or acted on.
 */
export function usableContent(content: BetaContentBlock[]): BetaContentBlock[] {
  const boundary = content.map((b) => b.type).lastIndexOf('fallback')
  if (boundary < 0) return content
  return content.filter(
    (b, i) => i > boundary || !['thinking', 'redacted_thinking', 'tool_use', 'server_tool_use'].includes(b.type),
  )
}

const textOf = (content: BetaContentBlock[]) =>
  content
    .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim()

type RunOptions = {
  client: Anthropic
  payload: Payload
  showPrices: boolean
  /** Full API history, appended to in place. */
  messages: BetaMessageParam[]
  transcript: TranscriptLine[]
  message: string
  emit: (event: ChatEvent) => void
  signal?: AbortSignal
}

/** Runs one visitor message through the expert, streaming text and tool events to `emit`. */
export async function runExpertTurn({ client, payload, showPrices, messages, transcript, message, emit, signal }: RunOptions) {
  const system = await systemPrompt(payload, showPrices)
  const tools = expertTools(showPrices)
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  const startLength = messages.length
  messages.push({ role: 'user', content: message })
  transcript.push({ role: 'visitor', text: message })
  let reply = ''

  for (let step = 0; step < MAX_STEPS; step++) {
    const stream = client.beta.messages.stream(
      {
        model: MODEL,
        max_tokens: 16000,
        betas: ['server-side-fallback-2026-07-01'],
        fallbacks: 'default',
        output_config: { effort: EFFORT },
        tools,
        system: [
          { type: 'text', text: system, cache_control: { type: 'ephemeral' } },
          { type: 'text', text: `Today's date is ${today}.` },
        ],
        // Cache the conversation so far, so each new message only pays for what is new.
        cache_control: { type: 'ephemeral' },
        messages,
      },
      { signal },
    )

    stream.on('text', (delta) => emit({ type: 'text', text: delta }))
    stream.on('streamEvent', (event) => {
      if (event.type === 'content_block_start' && event.content_block.type === 'tool_use') {
        emit({ type: 'status', text: TOOL_STATUS[event.content_block.name] ?? 'One moment…' })
      }
    })

    const final = await stream.finalMessage()

    if (final.stop_reason === 'refusal') {
      // Leave the history as it was before this message so the conversation can carry on.
      messages.length = startLength
      transcript.pop()
      emit({
        type: 'text',
        text: "\n\nPole, I can't help with that one. Is there anything about your safari I can help with?",
      })
      emit({ type: 'done' })
      return
    }

    const content = usableContent(final.content)
    messages.push({ role: 'assistant', content })
    reply += textOf(content) ? (reply ? '\n\n' : '') + textOf(content) : ''

    const toolUses = content.filter((b): b is Anthropic.Beta.BetaToolUseBlock => b.type === 'tool_use')
    if (final.stop_reason !== 'tool_use' || !toolUses.length) break

    const results: Anthropic.Beta.BetaToolResultBlockParam[] = []
    for (const use of toolUses) {
      let outcome: ToolOutcome
      try {
        outcome = await runTool(use.name, use.input, {
          payload,
          showPrices,
          transcript: () => [...transcript, ...(reply ? [{ role: 'expert' as const, text: reply }] : [])],
        })
      } catch (err) {
        payload.logger.error({ err }, `Expert tool ${use.name} failed`)
        outcome = { content: 'The tool failed. Apologise and offer to have the team follow up.', isError: true }
      }
      if (outcome.event) emit(outcome.event)
      results.push({ type: 'tool_result', tool_use_id: use.id, content: outcome.content, is_error: outcome.isError })
    }
    messages.push({ role: 'user', content: results })
    emit({ type: 'text', text: reply ? '\n\n' : '' })
  }

  // A turn must end on an assistant message; if the step limit cut it short, close it politely.
  if (messages.at(-1)?.role === 'user') {
    const note = 'Let me pass this to one of our team so they can look into it properly.'
    messages.push({ role: 'assistant', content: note })
    emit({ type: 'text', text: note })
    reply += (reply ? '\n\n' : '') + note
  }

  transcript.push({ role: 'expert', text: reply })
  emit({ type: 'done' })
}
