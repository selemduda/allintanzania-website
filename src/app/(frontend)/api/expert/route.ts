import Anthropic from '@anthropic-ai/sdk'
import { randomUUID } from 'crypto'

import { MAX_MESSAGE_LENGTH, MAX_TURNS, runExpertTurn, type ChatEvent, type TranscriptLine } from '@/lib/expert/chat'
import { getPayloadClient, getPublicExpert, getShowPrices } from '@/lib/payload'
import { clientIp, rateLimit } from '@/lib/rateLimit'
import type { ExpertChat } from '@/payload-types'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

const client = process.env.ANTHROPIC_API_KEY ? new Anthropic() : null

async function findChat(token: unknown) {
  if (typeof token !== 'string' || !/^[0-9a-f-]{36}$/.test(token)) return null
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'expert-chats',
    where: { token: { equals: token } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  return docs[0] ?? null
}

/** Restores a conversation after a page reload. */
export async function GET(req: Request) {
  const chat = await findChat(new URL(req.url).searchParams.get('token'))
  return Response.json({ transcript: (chat?.transcript as TranscriptLine[] | undefined) ?? [] })
}

export async function POST(req: Request) {
  const expert = await getPublicExpert()
  if (!client || !expert.enabled) {
    return Response.json({ error: 'Our AI expert is resting right now. Please leave us a message instead.', offline: true }, { status: 503 })
  }
  const ip = clientIp(req)
  if (!rateLimit(`expert:${ip}`, 20, 5 * 60_000) || !rateLimit(`expert-day:${ip}`, 200, 24 * 60 * 60_000)) {
    return Response.json({ error: 'You are sending messages very quickly. Please wait a moment.' }, { status: 429 })
  }

  const body = (await req.json().catch(() => null)) as { token?: unknown; message?: unknown } | null
  const message = typeof body?.message === 'string' ? body.message.trim().slice(0, MAX_MESSAGE_LENGTH) : ''
  if (!message) return Response.json({ error: 'Please type a message.' }, { status: 400 })

  const payload = await getPayloadClient()
  const existing = await findChat(body?.token)
  if (existing && (existing.turns ?? 0) >= MAX_TURNS) {
    return Response.json(
      { error: 'This conversation is getting long. Please send us your details and one of our team will take it from here.', limit: true },
      { status: 429 },
    )
  }
  const token = existing?.token ?? randomUUID()
  const messages = (existing?.messages as Anthropic.Beta.BetaMessageParam[] | undefined) ?? []
  const transcript = (existing?.transcript as TranscriptLine[] | undefined) ?? []
  const showPrices = await getShowPrices()

  const encoder = new TextEncoder()
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: ChatEvent | { type: 'token'; token: string }) => {
        // The visitor may have closed the page; keep going so the chat is still saved.
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`))
        } catch {}
      }
      send({ type: 'token', token })
      let enquiryId: number | undefined
      try {
        await runExpertTurn({
          client,
          payload,
          showPrices,
          messages,
          transcript,
          message,
          emit: (event) => {
            if (event.type === 'enquiry') enquiryId = event.id
            send(event.type === 'enquiry' ? { type: 'enquiry', id: 0 } : event)
          },
        })
        const data: Partial<ExpertChat> = {
          messages,
          transcript,
          turns: (existing?.turns ?? 0) + 1,
          ...(enquiryId ? { enquiry: enquiryId } : {}),
        }
        if (existing) {
          await payload.update({ collection: 'expert-chats', id: existing.id, data, overrideAccess: true })
        } else {
          await payload.create({
            collection: 'expert-chats',
            data: { ...data, token, summary: message.slice(0, 120) },
            overrideAccess: true,
          })
        }
      } catch (err) {
        payload.logger.error({ err }, 'Expert chat failed')
        const busy = err instanceof Anthropic.RateLimitError || err instanceof Anthropic.InternalServerError
        send({
          type: 'error',
          message: busy
            ? 'I have a lot of visitors right now. Please try again in a minute.'
            : 'Sorry, something went wrong on my side. Please try again, or leave us a message.',
        })
      } finally {
        try {
          controller.close()
        } catch {}
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
    },
  })
}
