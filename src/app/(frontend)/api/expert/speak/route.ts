import { getPayloadClient } from '@/lib/payload'
import { clientIp, rateLimit } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

/** Reads the expert's reply aloud with ElevenLabs, when that voice is configured in the admin. */
export async function POST(req: Request) {
  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey) return Response.json({ error: 'Voice not configured' }, { status: 404 })
  if (!rateLimit(`speak:${clientIp(req)}`, 30, 5 * 60_000)) {
    return Response.json({ error: 'Too many requests' }, { status: 429 })
  }
  const body = (await req.json().catch(() => null)) as { text?: unknown } | null
  const text = typeof body?.text === 'string' ? body.text.trim().slice(0, 2500) : ''
  if (!text) return Response.json({ error: 'No text' }, { status: 400 })

  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'expert-settings', depth: 0, overrideAccess: true })
  const voiceId = settings.voice?.voiceId
  if (settings.voice?.provider !== 'elevenlabs' || !voiceId) {
    return Response.json({ error: 'Voice not configured' }, { status: 404 })
  }

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}/stream?output_format=mp3_44100_128`,
    {
      method: 'POST',
      headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
      body: JSON.stringify({ text, model_id: process.env.ELEVENLABS_MODEL || 'eleven_multilingual_v2' }),
    },
  )
  if (!res.ok || !res.body) {
    payload.logger.error(`ElevenLabs ${res.status}: ${await res.text().catch(() => '')}`)
    return Response.json({ error: 'Voice unavailable' }, { status: 502 })
  }
  return new Response(res.body, { headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-store' } })
}
