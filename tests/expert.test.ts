import type Anthropic from '@anthropic-ai/sdk'
import type { Payload } from 'payload'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/notify', () => ({ notifyTeam: vi.fn(async () => {}) }))

import { runExpertTurn, usableContent, type ChatEvent, type TranscriptLine } from '@/lib/expert/chat'
import { lexicalToText } from '@/lib/expert/knowledge'
import { expertTools } from '@/lib/expert/tools'

type Block = Anthropic.Beta.BetaContentBlock

const fakePayload = () => {
  const created: { collection: string; data: Record<string, unknown> }[] = []
  const payload = {
    logger: { error: vi.fn() },
    findGlobal: vi.fn(async ({ slug }: { slug: string }) =>
      slug === 'expert-settings' ? { expertName: 'Baraka', personality: 'Warm.', facts: [] } : { companyName: 'All in Tanzania' },
    ),
    find: vi.fn(async ({ collection, where }: { collection: string; where?: { slug?: { equals: string } } }) => {
      if (collection === 'itineraries' && where?.slug?.equals === 'great-migration') {
        return {
          docs: [
            {
              title: 'Great Migration',
              durationDays: 7,
              summary: 'Follow the herds.',
              days: [{ dayRange: 'Day 1', title: 'Arusha', destination: { name: 'Arusha' } }],
            },
          ],
        }
      }
      return { docs: [] }
    }),
    create: vi.fn(async (args: { collection: string; data: Record<string, unknown> }) => {
      created.push(args)
      return { id: 7, ...args.data }
    }),
  }
  return { payload: payload as unknown as Payload, created }
}

/** A stand-in for client.beta.messages.stream that replays canned responses. */
const fakeClient = (responses: { content: Block[]; stop_reason: string }[]) => {
  const requests: Anthropic.Beta.MessageCreateParams[] = []
  const stream = vi.fn((params: Anthropic.Beta.MessageCreateParams) => {
    // Snapshot: the engine keeps appending to the same array.
    requests.push({ ...params, messages: [...params.messages] })
    const response = responses.shift()!
    const handlers: Record<string, ((arg: unknown) => void)[]> = {}
    return {
      on(event: string, fn: (arg: unknown) => void) {
        ;(handlers[event] ??= []).push(fn)
        return this
      },
      async finalMessage() {
        for (const block of response.content) {
          if (block.type === 'tool_use') {
            handlers.streamEvent?.forEach((fn) => fn({ type: 'content_block_start', content_block: block }))
          }
          if (block.type === 'text') handlers.text?.forEach((fn) => fn(block.text))
        }
        return response
      },
    }
  })
  return { client: { beta: { messages: { stream } } } as unknown as Anthropic, requests }
}

const text = (t: string) => ({ type: 'text', text: t, citations: null }) as Block
const toolUse = (id: string, name: string, input: unknown) => ({ type: 'tool_use', id, name, input }) as Block

describe('AI expert', () => {
  it('runs a tool and continues the conversation with its result', async () => {
    const { payload } = fakePayload()
    const { client, requests } = fakeClient([
      { content: [toolUse('t1', 'get_details', { kind: 'safari', slug: 'great-migration' })], stop_reason: 'tool_use' },
      { content: [text('The Great Migration safari is 7 days.')], stop_reason: 'end_turn' },
    ])
    const messages: Anthropic.Beta.BetaMessageParam[] = []
    const transcript: TranscriptLine[] = []
    const events: ChatEvent[] = []
    await runExpertTurn({ client, payload, showPrices: false, messages, transcript, message: 'Tell me about the migration safari', emit: (e) => events.push(e) })

    expect(requests).toHaveLength(2)
    expect(requests[0].model).toBe('claude-opus-5-5')
    expect(requests[0].tools!.map((t) => (t as { name: string }).name)).toEqual(['get_details', 'save_enquiry'])
    const toolResult = (messages[2].content as Anthropic.Beta.BetaToolResultBlockParam[])[0]
    expect(toolResult).toMatchObject({ type: 'tool_result', tool_use_id: 't1' })
    expect(String(toolResult.content)).toContain('Day 1: Arusha')
    expect(messages.map((m) => m.role)).toEqual(['user', 'assistant', 'user', 'assistant'])
    expect(events).toContainEqual({ type: 'status', text: 'Looking that up…' })
    expect(events.at(-1)).toEqual({ type: 'done' })
    expect(transcript).toEqual([
      { role: 'visitor', text: 'Tell me about the migration safari' },
      { role: 'expert', text: 'The Great Migration safari is 7 days.' },
    ])
  })

  it('saves an enquiry with the chat transcript', async () => {
    const { payload, created } = fakePayload()
    const { client } = fakeClient([
      {
        content: [toolUse('t1', 'save_enquiry', { name: 'Ana', email: 'ana@example.com', summary: 'Family safari in July' })],
        stop_reason: 'tool_use',
      },
      { content: [text('Asante, Ana!')], stop_reason: 'end_turn' },
    ])
    const events: ChatEvent[] = []
    await runExpertTurn({ client, payload, showPrices: false, messages: [], transcript: [], message: 'Yes please contact me', emit: (e) => events.push(e) })
    expect(created[0]).toMatchObject({
      collection: 'enquiries',
      data: { name: 'Ana', email: 'ana@example.com', source: 'ai', chatTranscript: [{ role: 'visitor', text: 'Yes please contact me' }] },
    })
    expect(events).toContainEqual({ type: 'enquiry', id: 7 })
  })

  it('rejects invalid tool input without running it', async () => {
    const { payload, created } = fakePayload()
    const { client } = fakeClient([
      { content: [toolUse('t1', 'save_enquiry', { name: 'Ana', email: 'not-an-email', summary: 'x' })], stop_reason: 'tool_use' },
      { content: [text('Could you check your email address?')], stop_reason: 'end_turn' },
    ])
    const messages: Anthropic.Beta.BetaMessageParam[] = []
    await runExpertTurn({ client, payload, showPrices: false, messages, transcript: [], message: 'hi', emit: () => {} })
    expect(created).toHaveLength(0)
    expect((messages[2].content as Anthropic.Beta.BetaToolResultBlockParam[])[0].is_error).toBe(true)
  })

  it('leaves the history unchanged after a refusal', async () => {
    const { payload } = fakePayload()
    const { client } = fakeClient([{ content: [], stop_reason: 'refusal' }])
    const messages: Anthropic.Beta.BetaMessageParam[] = [
      { role: 'user', content: 'hello' },
      { role: 'assistant', content: 'Karibu!' },
    ]
    const transcript: TranscriptLine[] = [{ role: 'visitor', text: 'hello' }]
    await runExpertTurn({ client, payload, showPrices: false, messages, transcript, message: 'something odd', emit: () => {} })
    expect(messages).toHaveLength(2)
    expect(transcript).toHaveLength(1)
  })

  it('only offers price estimates when prices are public', () => {
    expect(expertTools(true).map((t) => t.name)).toContain('estimate_trip')
    expect(expertTools(false).map((t) => t.name)).not.toContain('estimate_trip')
  })

  it('drops pre-fallback blocks other than text', () => {
    const content = [
      { type: 'thinking', thinking: '', signature: 's' },
      text('partial '),
      toolUse('t0', 'get_details', {}),
      { type: 'fallback', from: { model: 'a' }, to: { model: 'b' } },
      toolUse('t1', 'get_details', {}),
    ] as Block[]
    expect(usableContent(content).map((b) => b.type)).toEqual(['text', 'fallback', 'tool_use'])
  })

  it('flattens rich text', () => {
    const value = { root: { children: [{ children: [{ text: 'Hello ' }, { text: 'world' }] }, { children: [{ text: 'Two' }] }] } }
    expect(lexicalToText(value)).toBe('Hello world\n\nTwo')
  })
})
