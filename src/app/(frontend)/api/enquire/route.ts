import { estimateTrip, loadPricingContext, parseTripRequest, publicEstimate } from '@/lib/pricing'
import { getPayloadClient, getShowPrices } from '@/lib/payload'
import { clientIp, rateLimit } from '@/lib/rateLimit'
import { notifyTeam } from '@/lib/notify'

const str = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

export async function POST(req: Request) {
  if (!rateLimit(`enquire:${clientIp(req)}`, 5, 10 * 60_000)) {
    return Response.json({ error: 'Too many enquiries from this connection. Please email us instead.' }, { status: 429 })
  }
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null
  if (!body) return Response.json({ error: 'Invalid request' }, { status: 400 })
  // Honeypot: real visitors never fill this hidden field.
  if (str(body.website)) return Response.json({ ok: true })

  const name = str(body.name)
  const email = str(body.email)
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: 'Please give your name and a valid email address.' }, { status: 400 })
  }

  const payload = await getPayloadClient()
  let trip = null
  let estimate = null
  if (body.trip) {
    const parsed = parseTripRequest(body.trip)
    if (typeof parsed !== 'string') {
      trip = parsed
      estimate = estimateTrip(parsed, await loadPricingContext(payload))
    }
  }

  const source = body.source === 'builder' || body.source === 'ai' ? body.source : 'contact'
  const doc = await payload.create({
    collection: 'enquiries',
    overrideAccess: true,
    data: {
      name,
      email,
      phone: str(body.phone, 40),
      country: str(body.country, 80),
      travelMonth: str(body.travelMonth, 40),
      adults: trip?.adults ?? (Number(body.adults) || undefined),
      children: trip?.children ?? (Number(body.children) || undefined),
      message: str(body.message, 5000),
      trip,
      estimate,
      estimateTotal: estimate?.total,
      source,
    },
  })
  await notifyTeam(payload, doc).catch((err) => payload.logger.error({ err }, 'Enquiry email failed'))
  // The team always gets the internal estimate; visitors only when prices are public.
  const showPrices = await getShowPrices()
  return Response.json({ ok: true, estimate: estimate && showPrices ? publicEstimate(estimate) : null })
}
