import type { Payload } from 'payload'

import { MONTHS } from '../collections/Destinations'
import type { Destination, PricingSetting } from '../payload-types'
import type { Category, RateRow, Season } from './priceList'

export type Tier = 'comfort' | 'classic' | 'luxury'

export type TripRequest = {
  stops: { destination: string; nights: number }[]
  /** 1-12 */
  month: number
  adults: number
  children?: number
  tier: Tier
  activities?: string[]
}

export type EstimateLine = { label: string; detail: string; amount: number }

export type Estimate = {
  currency: 'USD'
  season: Season
  nights: number
  days: number
  travellers: number
  vehicles: number
  lines: EstimateLine[]
  subtotal: number
  markup: number
  total: number
  low: number
  high: number
  perPerson: number
  usedFallback: boolean
  notes: string[]
  disclaimer: string
}

const SAFARI_TYPES = new Set(['park', 'conservation', 'reserve'])
const round = (n: number, to = 10) => Math.round(n / to) * to

type Context = {
  rates: RateRow[]
  settings: PricingSetting
  destinations: Map<string, Pick<Destination, 'slug' | 'name' | 'type'>>
}

/** Rows for a category, ranked so the most specific match (destination, tier, season) wins. */
function match(
  rates: RateRow[],
  category: Category,
  { destination, tier, season }: { destination?: string | null; tier?: string | null; season: Season },
) {
  const candidates = rates.filter(
    (r) =>
      r.category === category &&
      (r.destination === null || r.destination === destination) &&
      (r.tier === null || r.tier === tier) &&
      (r.season === 'all' || r.season === season),
  )
  const score = (r: RateRow) =>
    (r.destination && r.destination === destination ? 4 : 0) +
    (r.tier && r.tier === tier ? 2 : 0) +
    (r.season === season ? 1 : 0)
  const best = Math.max(-1, ...candidates.map(score))
  return candidates.filter((r) => score(r) === best)
}

const median = (values: number[]) => {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

export function estimateTrip(req: TripRequest, ctx: Context): Estimate {
  const { rates, settings } = ctx
  const monthKey = MONTHS[Math.min(Math.max(req.month, 1), 12) - 1].toLowerCase() as keyof PricingSetting['seasons']
  const season = (settings.seasons?.[monthKey] ?? 'high') as Season
  const adults = Math.max(1, Math.floor(req.adults))
  const children = Math.max(0, Math.floor(req.children ?? 0))
  const travellers = adults + children
  const vehicles = Math.ceil(travellers / (settings.vehicleCapacity || 6))
  const stops = req.stops.filter((s) => s.nights > 0 && ctx.destinations.has(s.destination))
  const nights = stops.reduce((sum, s) => sum + s.nights, 0)
  const lines: EstimateLine[] = []
  const notes: string[] = []
  let usedFallback = false

  const people = (r: { adult: number; child: number | null }) => r.adult * adults + (r.child ?? r.adult) * children

  let safariDays = 0
  for (const stop of stops) {
    const dest = ctx.destinations.get(stop.destination)!
    const where = { destination: stop.destination, tier: req.tier, season }

    // Accommodation
    const lodgeRows = match(rates, 'lodge', where)
    if (lodgeRows.length) {
      const adult = median(lodgeRows.map((r) => r.adult))
      const childRates = lodgeRows.map((r) => r.child).filter((c): c is number => c != null)
      const child = childRates.length ? median(childRates) : adult
      const names = lodgeRows.length === 1 ? lodgeRows[0].item : `typical of ${lodgeRows.length} camps`
      lines.push({
        label: `${dest.name}: ${stop.nights} night${stop.nights > 1 ? 's' : ''}`,
        detail: `Accommodation (${names})`,
        amount: stop.nights * (adult * adults + child * children),
      })
    } else {
      const adult = settings.fallbackLodgeRates?.[req.tier] ?? 400
      usedFallback = true
      lines.push({
        label: `${dest.name}: ${stop.nights} night${stop.nights > 1 ? 's' : ''}`,
        detail: 'Accommodation (typical rate)',
        amount: stop.nights * (adult * adults + adult * 0.5 * children),
      })
    }

    // Park and conservation fees, charged per day inside the park
    for (const fee of match(rates, 'park_fee', where).filter((r) => r.destination === stop.destination)) {
      const days = fee.unit === 'per_person_per_day' ? stop.nights : 1
      lines.push({
        label: `${dest.name}: ${fee.item}`,
        detail: fee.unit === 'per_person_per_day' ? `${days} day${days > 1 ? 's' : ''}` : 'per person',
        amount: days * people(fee),
      })
    }

    // Flights or transfers specific to this stop (e.g. a bush flight to Ruaha)
    for (const row of [...match(rates, 'flight', where), ...match(rates, 'transfer', where)]) {
      if (row.destination !== stop.destination) continue
      lines.push({
        label: row.item,
        detail: row.unit === 'per_group' ? 'per group' : 'per person',
        amount: row.unit === 'per_group' ? row.adult : people(row),
      })
    }

    if (SAFARI_TYPES.has(dest.type ?? '')) safariDays += stop.nights
  }

  // Vehicle and guide for game-drive days (plus the day you drive out)
  if (safariDays > 0) {
    const days = safariDays + 1
    for (const category of ['vehicle', 'guide'] as const) {
      const row = match(rates, category, { tier: req.tier, season })[0]
      if (!row) continue
      lines.push({
        label: row.item,
        detail: `${vehicles} × ${days} days`,
        amount: row.unit === 'per_vehicle_per_day' ? row.adult * vehicles * days : people(row) * days,
      })
    }
  }

  // Arrival and departure transfers that apply to every trip
  for (const row of match(rates, 'transfer', { tier: req.tier, season }).filter((r) => r.destination === null)) {
    lines.push({
      label: row.item,
      detail: row.unit === 'per_group' ? 'per group' : 'per person',
      amount: row.unit === 'per_group' ? row.adult * vehicles : people(row),
    })
  }

  for (const name of req.activities ?? []) {
    const row = rates.find((r) => r.category === 'activity' && r.item.toLowerCase() === name.toLowerCase())
    if (!row) continue
    lines.push({ label: row.item, detail: 'activity', amount: row.unit === 'per_group' ? row.adult : people(row) })
  }

  if (usedFallback) notes.push('Some stays use a typical rate because they are not in our current price list yet.')
  if (!rates.length) notes.push('Our detailed price list is being updated, so this estimate uses typical rates.')
  if (children) notes.push(`Child rates apply to guests under ${settings.childAgeLimit ?? 15}.`)

  const subtotal = lines.reduce((sum, l) => sum + l.amount, 0)
  const markup = subtotal * ((settings.markupPercent ?? 0) / 100)
  const total = round(subtotal + markup)
  const range = (settings.rangePercent ?? 10) / 100
  return {
    currency: 'USD',
    season,
    nights,
    days: nights + 1,
    travellers,
    vehicles,
    // Customers see costs with our margin spread across each line, never the margin itself.
    lines: lines.map((l) => ({
      ...l,
      amount: round(subtotal ? l.amount * (1 + markup / subtotal) : l.amount, 1),
    })),
    subtotal: round(subtotal),
    markup: round(markup),
    total,
    low: round(total * (1 - range), 50),
    high: round(total * (1 + range), 50),
    perPerson: round(total / travellers),
    usedFallback,
    notes,
    disclaimer: settings.disclaimer ?? '',
  }
}

/** Public view: strips our cost and margin. */
export const publicEstimate = ({ subtotal: _s, markup: _m, ...rest }: Estimate) => rest

export async function loadPricingContext(payload: Payload): Promise<Context> {
  const [settings, lists, dests] = await Promise.all([
    payload.findGlobal({ slug: 'pricing-settings', overrideAccess: true }),
    payload.find({ collection: 'price-lists', where: { active: { equals: true } }, limit: 1, overrideAccess: true }),
    payload.find({
      collection: 'destinations',
      where: { _status: { equals: 'published' } },
      limit: 200,
      depth: 0,
      select: { slug: true, name: true, type: true },
    }),
  ])
  const rates = (lists.docs[0]?.rates as RateRow[] | undefined) ?? []
  return {
    rates,
    settings,
    destinations: new Map(dests.docs.filter((d) => d.slug).map((d) => [d.slug as string, d])),
  }
}

export function parseTripRequest(body: unknown): TripRequest | string {
  if (!body || typeof body !== 'object') return 'Invalid request'
  const b = body as Record<string, unknown>
  const stops = Array.isArray(b.stops)
    ? b.stops
        .filter((s): s is { destination: string; nights: number } =>
          Boolean(s && typeof s.destination === 'string' && Number.isFinite(Number(s.nights))),
        )
        .map((s) => ({ destination: s.destination, nights: Math.min(30, Math.max(0, Math.floor(Number(s.nights)))) }))
        .slice(0, 12)
    : []
  if (!stops.length) return 'Choose at least one destination'
  const month = Number(b.month)
  if (!(month >= 1 && month <= 12)) return 'Choose a travel month'
  const tier = (['comfort', 'classic', 'luxury'] as const).find((t) => t === b.tier) ?? 'classic'
  const adults = Math.min(30, Math.max(1, Math.floor(Number(b.adults) || 2)))
  const children = Math.min(20, Math.max(0, Math.floor(Number(b.children) || 0)))
  const activities = Array.isArray(b.activities) ? b.activities.filter((a): a is string => typeof a === 'string').slice(0, 10) : []
  return { stops, month, adults, children, tier, activities }
}
