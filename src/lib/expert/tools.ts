import type Anthropic from '@anthropic-ai/sdk'
import type { Payload } from 'payload'
import { z } from 'zod'

import { notifyTeam } from '@/lib/notify'
import { estimateTrip, loadPricingContext, publicEstimate, type Estimate } from '@/lib/pricing'
import type { Destination, Lodge } from '@/payload-types'

import { lexicalToText } from './knowledge'

const stopSchema = {
  type: 'object',
  properties: {
    destination: { type: 'string', description: 'Destination slug, e.g. serengeti' },
    nights: { type: 'integer', minimum: 0, maximum: 30 },
  },
  required: ['destination', 'nights'],
} as const

const tierSchema = { type: 'string', enum: ['comfort', 'classic', 'luxury'] } as const

const GET_DETAILS: Anthropic.Beta.BetaTool = {
  name: 'get_details',
  description:
    'Look up the full write-up of one of our destinations, lodges or safaris (itineraries), including the day-by-day plan of a safari. Use the slug from your knowledge list.',
  eager_input_streaming: true,
  input_schema: {
    type: 'object',
    properties: {
      kind: { type: 'string', enum: ['destination', 'lodge', 'safari'] },
      slug: { type: 'string' },
    },
    required: ['kind', 'slug'],
  },
}

const ESTIMATE_TRIP: Anthropic.Beta.BetaTool = {
  name: 'estimate_trip',
  description:
    "Estimate the price of a trip from the company's current price list. Returns a price range for the whole group and per person, the season, and what is included. Use it whenever the visitor asks about cost.",
  eager_input_streaming: true,
  input_schema: {
    type: 'object',
    properties: {
      stops: { type: 'array', items: stopSchema, minItems: 1, description: 'Destinations in travel order' },
      month: { type: 'integer', minimum: 1, maximum: 12, description: 'Travel month, 1 = January' },
      adults: { type: 'integer', minimum: 1 },
      children: { type: 'integer', minimum: 0 },
      tier: tierSchema,
    },
    required: ['stops', 'month', 'adults', 'tier'],
  },
}

const SAVE_ENQUIRY: Anthropic.Beta.BetaTool = {
  name: 'save_enquiry',
  description:
    'Pass the visitor and their trip wishes to the sales team, who then contact them. Only call this after the visitor has given their name and email and agreed to be contacted.',
  eager_input_streaming: true,
  input_schema: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      email: { type: 'string' },
      phone: { type: 'string' },
      country: { type: 'string', description: 'Where the visitor lives' },
      travel_month: { type: 'string', description: 'When they want to travel, in their words' },
      adults: { type: 'integer', minimum: 1 },
      children: { type: 'integer', minimum: 0 },
      summary: {
        type: 'string',
        description: 'What the visitor wants, for the team: interests, budget, dates, special needs, anything agreed.',
      },
      stops: { type: 'array', items: stopSchema, description: 'Proposed route, if one was discussed' },
      month: { type: 'integer', minimum: 1, maximum: 12 },
      tier: tierSchema,
    },
    required: ['name', 'email', 'summary'],
  },
}

export function expertTools(showPrices: boolean): Anthropic.Beta.BetaTool[] {
  return showPrices ? [GET_DETAILS, ESTIMATE_TRIP, SAVE_ENQUIRY] : [GET_DETAILS, SAVE_ENQUIRY]
}

/** Short status line the chat shows while a tool runs. */
export const TOOL_STATUS: Record<string, string> = {
  get_details: 'Looking that up…',
  estimate_trip: 'Checking our price list…',
  save_enquiry: 'Passing your details to the team…',
}

const Stop = z.object({ destination: z.string().max(80), nights: z.number().int().min(0).max(30) })
const Tier = z.enum(['comfort', 'classic', 'luxury'])
const inputs = {
  get_details: z.object({ kind: z.enum(['destination', 'lodge', 'safari']), slug: z.string().max(120) }),
  estimate_trip: z.object({
    stops: z.array(Stop).min(1).max(12),
    month: z.number().int().min(1).max(12),
    adults: z.number().int().min(1).max(30),
    children: z.number().int().min(0).max(20).optional(),
    tier: Tier,
  }),
  save_enquiry: z.object({
    name: z.string().min(1).max(200),
    email: z.string().email().max(200),
    phone: z.string().max(40).optional(),
    country: z.string().max(80).optional(),
    travel_month: z.string().max(40).optional(),
    adults: z.number().int().min(1).max(30).optional(),
    children: z.number().int().min(0).max(20).optional(),
    summary: z.string().max(5000),
    stops: z.array(Stop).max(12).optional(),
    month: z.number().int().min(1).max(12).optional(),
    tier: Tier.optional(),
  }),
}

export type ToolContext = {
  payload: Payload
  showPrices: boolean
  /** Plain-text conversation so far, attached to enquiries for the team. */
  transcript: () => { role: string; text: string }[]
}

export type ToolOutcome = {
  content: string
  isError?: boolean
  /** Extra data the chat UI renders, such as an estimate card. */
  event?: { type: 'estimate'; estimate: ReturnType<typeof publicEstimate>; route: string; tier: string } | { type: 'enquiry'; id: number }
}

const routeParam = (stops: { destination: string; nights: number }[]) =>
  stops.map((s) => `${s.destination}:${s.nights}`).join(',')

export async function runTool(name: string, rawInput: unknown, ctx: ToolContext): Promise<ToolOutcome> {
  const { payload } = ctx
  switch (name) {
    case 'get_details': {
      const parsed = inputs.get_details.safeParse(rawInput)
      if (!parsed.success) return { content: `Invalid input: ${parsed.error.message}`, isError: true }
      const { kind, slug } = parsed.data
      const collection = kind === 'safari' ? 'itineraries' : kind === 'lodge' ? 'lodges' : 'destinations'
      const { docs } = await payload.find({
        collection,
        where: { slug: { equals: slug }, _status: { equals: 'published' } },
        depth: 1,
        limit: 1,
      })
      const doc = docs[0]
      if (!doc) return { content: `No ${kind} with slug "${slug}".`, isError: true }
      if (collection === 'itineraries' && 'days' in doc) {
        const days = (doc.days ?? [])
          .map((d) => {
            const where = [(d.destination as Destination | null)?.name, (d.lodge as Lodge | null)?.name].filter(Boolean)
            return `${d.dayRange}: ${d.title}${where.length ? ` (${where.join(', ')})` : ''}${d.description ? `. ${d.description}` : ''}`
          })
          .join('\n')
        return {
          content: [
            `${doc.title}, ${doc.durationDays} days`,
            doc.summary,
            days,
            doc.included?.length ? `Included: ${doc.included.join('; ')}` : '',
            doc.excluded?.length ? `Not included: ${doc.excluded.join('; ')}` : '',
          ]
            .filter(Boolean)
            .join('\n\n'),
        }
      }
      const d = doc as Destination | Lodge
      return { content: [d.name, d.summary, lexicalToText(d.body)].filter(Boolean).join('\n\n') }
    }

    case 'estimate_trip': {
      if (!ctx.showPrices) return { content: 'Prices are on request; offer to pass the plan to the team.', isError: true }
      const parsed = inputs.estimate_trip.safeParse(rawInput)
      if (!parsed.success) return { content: `Invalid input: ${parsed.error.message}`, isError: true }
      const pricing = await loadPricingContext(payload)
      const unknown = parsed.data.stops.filter((s) => !pricing.destinations.has(s.destination))
      if (unknown.length) {
        return { content: `Unknown destination slugs: ${unknown.map((s) => s.destination).join(', ')}`, isError: true }
      }
      const estimate = publicEstimate(estimateTrip({ ...parsed.data, children: parsed.data.children ?? 0 }, pricing))
      return {
        content: JSON.stringify(estimate),
        event: { type: 'estimate', estimate, route: routeParam(parsed.data.stops), tier: parsed.data.tier },
      }
    }

    case 'save_enquiry': {
      const parsed = inputs.save_enquiry.safeParse(rawInput)
      if (!parsed.success) return { content: `Invalid input: ${parsed.error.message}`, isError: true }
      const e = parsed.data
      let trip = null
      let estimate: Estimate | null = null
      if (e.stops?.length) {
        const pricing = await loadPricingContext(payload)
        const stops = e.stops.filter((s) => pricing.destinations.has(s.destination))
        if (stops.length) {
          trip = { stops, month: e.month ?? 0, adults: e.adults ?? 2, children: e.children ?? 0, tier: e.tier ?? 'classic' }
          // Internal estimate for the team, whatever the website shows.
          if (trip.month) estimate = estimateTrip(trip, pricing)
        }
      }
      const doc = await payload.create({
        collection: 'enquiries',
        overrideAccess: true,
        data: {
          name: e.name,
          email: e.email,
          phone: e.phone,
          country: e.country,
          travelMonth: e.travel_month,
          adults: e.adults,
          children: e.children,
          message: e.summary,
          trip,
          estimate,
          estimateTotal: estimate?.total,
          chatTranscript: ctx.transcript(),
          source: 'ai',
        },
      })
      await notifyTeam(payload, doc).catch((err) => payload.logger.error({ err }, 'Enquiry email failed'))
      return { content: `Saved. Enquiry #${doc.id}. The team will be in touch.`, event: { type: 'enquiry', id: doc.id } }
    }

    default:
      return { content: `Unknown tool ${name}`, isError: true }
  }
}
