import { estimateTrip, loadPricingContext, parseTripRequest, publicEstimate } from '@/lib/pricing'
import { getPayloadClient, getShowPrices } from '@/lib/payload'
import { clientIp, rateLimit } from '@/lib/rateLimit'

export async function POST(req: Request) {
  if (!rateLimit(`estimate:${clientIp(req)}`, 60, 60_000)) {
    return Response.json({ error: 'Too many requests, please slow down.' }, { status: 429 })
  }
  const trip = parseTripRequest(await req.json().catch(() => null))
  if (typeof trip === 'string') return Response.json({ error: trip }, { status: 400 })
  if (!(await getShowPrices())) return Response.json({ estimate: null, onRequest: true })
  const payload = await getPayloadClient()
  const estimate = estimateTrip(trip, await loadPricingContext(payload))
  return Response.json({ estimate: publicEstimate(estimate) })
}
