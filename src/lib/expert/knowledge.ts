import type { Payload } from 'payload'

import type { Destination, Lodge } from '@/payload-types'

/** Flattens Lexical rich text to plain paragraphs for the model. */
export function lexicalToText(value: unknown): string {
  const out: string[] = []
  const walk = (node: unknown): string => {
    if (!node || typeof node !== 'object') return ''
    const n = node as { text?: string; children?: unknown[] }
    if (typeof n.text === 'string') return n.text
    return (n.children ?? []).map(walk).join('')
  }
  const root = (value as { root?: { children?: unknown[] } } | null)?.root
  for (const block of root?.children ?? []) {
    const text = walk(block).trim()
    if (text) out.push(text)
  }
  return out.join('\n\n')
}

const slugOf = (rel: number | { slug?: string | null } | null | undefined) =>
  rel && typeof rel === 'object' ? rel.slug : undefined

const list = (items?: (string | null | undefined)[] | null) => (items ?? []).filter(Boolean).join(', ')

/** Everything the expert knows about the company, written as a stable block so it can be prompt-cached. */
export async function buildSystemPrompt(payload: Payload, showPrices: boolean) {
  const [expert, site, destinations, lodges, itineraries] = await Promise.all([
    payload.findGlobal({ slug: 'expert-settings', depth: 0, overrideAccess: true }),
    payload.findGlobal({ slug: 'site-settings', depth: 0, overrideAccess: true }),
    payload.find({
      collection: 'destinations',
      where: { _status: { equals: 'published' } },
      sort: 'order',
      limit: 200,
      depth: 0,
    }),
    payload.find({ collection: 'lodges', where: { _status: { equals: 'published' } }, limit: 300, depth: 1 }),
    payload.find({ collection: 'itineraries', where: { _status: { equals: 'published' } }, limit: 100, depth: 1 }),
  ])

  const name = expert.expertName || 'Baraka'
  const company = site.companyName || 'All in Tanzania'

  const destinationText = destinations.docs
    .map((d: Destination) =>
      [
        `### ${d.name} (slug: ${d.slug}; ${d.type ?? 'destination'}, ${d.region ?? ''} Tanzania)`,
        d.tagline,
        d.summary,
        d.highlights?.length ? `Highlights: ${list(d.highlights.map((h) => h.text))}` : '',
        d.wildlife?.length ? `Wildlife: ${list(d.wildlife)}` : '',
        d.bestMonths?.length ? `Best months: ${list(d.bestMonths)}` : '',
        d.recommendedNights ? `Recommended nights: ${d.recommendedNights}` : '',
        d.expertNotes ? `Guide's notes: ${d.expertNotes}` : '',
      ]
        .filter(Boolean)
        .join('\n'),
    )
    .join('\n\n')

  const lodgeText = lodges.docs
    .map(
      (l: Lodge) =>
        `- ${l.name} (slug: ${l.slug}; in ${slugOf(l.destination as Destination) ?? '?'}; ${l.tier}${l.style ? `, ${l.style}` : ''}): ${l.summary}`,
    )
    .join('\n')

  const itineraryText = itineraries.docs
    .map((i) => {
      const route = (i.days ?? [])
        .filter((d) => d.nights)
        .map((d) => `${slugOf(d.destination as Destination) ?? d.title}:${d.nights}`)
        .join(', ')
      return `- ${i.title} (slug: ${i.slug}; ${i.durationDays} days${showPrices && i.fromPrice ? `; from $${i.fromPrice} pp` : ''}${
        i.styles?.length ? `; ${list(i.styles)}` : ''
      }): ${i.summary}${route ? ` Route (destination:nights): ${route}.` : ''}`
    })
    .join('\n')

  const facts = (expert.facts ?? []).map((f) => `- ${f.fact}`).join('\n')
  const contact = [
    site.email && `Email: ${site.email}`,
    site.phone && `Phone: ${site.phone}`,
    site.whatsapp && `WhatsApp: ${site.whatsapp}`,
    site.address && `Office: ${site.address.replace(/\n/g, ', ')}`,
  ]
    .filter(Boolean)
    .join('\n')

  return `You are ${name}, ${expert.expertTitle || 'Safari Expert'} at ${company}, a Tanzanian safari company. You chat with visitors on the company website, by text or by voice, and help them shape a safari that fits them.

You are an AI assistant that has learned from ${company}'s guides and planners. Never claim to be a human or to have personally guided trips. If someone asks whether you are a person, say plainly that you are the company's AI expert and that a real member of the team follows up on every enquiry.

## How you speak
${expert.personality || 'Warm, knowledgeable and honest, like a seasoned Tanzanian guide.'}

Keep replies short and conversational: usually two or three short paragraphs, because they may be read aloud. Ask one question at a time. Use plain sentences; a short list is fine when comparing options. Reply in the visitor's language.

## How you work
- Recommend ${company}'s own safaris, destinations and lodges below first. Link to them with Markdown links: /destinations/<slug>, /lodges/<slug>, /safaris/<slug>, and /plan for the trip builder.
- To learn what the visitor wants, find out roughly: when they want to travel, how many adults and children, how many days, what they dream of seeing, and their comfort level (comfort, classic or luxury).
${
    showPrices
      ? '- Never invent prices. For any price question, call estimate_trip with a route made of destination slugs and nights. Present the result as an estimated range per trip and per person, say which season it falls in, and mention that the team confirms the exact price. If a route mixes destinations we do not have, say so.'
      : '- Prices are on request: every trip is tailor-made and the team sends a personal quote. Never give or guess prices, price ranges or "from" prices, even if asked repeatedly. You can explain what drives the price (season, lodge level, number of nights, group size, flights between parks) and offer to pass their plan to the team for a quote.'
  }
- Call get_details when you need the day-by-day of a safari, or more about a destination or lodge than the summary below.
- Only talk about availability, visas, vaccinations and travel insurance in general terms and suggest checking official sources; the team helps with specifics.
- When the visitor wants to book, get a quote or talk to a person, ask for their name and email (phone optional). Only after they have given them and agreed to be contacted, call save_enquiry with a clear summary of what they want. Then tell them someone from the team will be in touch, usually within one working day.
- If you do not know something, say so and offer to have the team follow up. Do not make up facts about lodges, parks or the company.

## Company facts
${facts || '- (none added yet)'}

## Contact details
${contact || '(not set)'}

## Destinations
${destinationText}

## Lodges and camps we work with
${lodgeText}

## Our safaris (itineraries)
${itineraryText}`
}
