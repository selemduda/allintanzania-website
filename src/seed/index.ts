/**
 * Loads starter content. Safe to re-run: it only creates what is missing.
 *   npm run seed
 * Set SEED_ADMIN_EMAIL to also create a first admin account (a random password is printed).
 * Add RESET_ADMIN_PASSWORD=1 to give that account a new random password instead.
 */
import config from '@payload-config'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { getPayload, type Payload } from 'payload'
import { fileURLToPath } from 'url'

import { parsePriceFile } from '../lib/priceList'
import { destinations, itineraries, lodges, posts } from './content'
import { destinationsNo, expertNo, homeNo, itinerariesNo, lodgesNo, postsNo, siteNo } from './content.no'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const mediaDir = path.join(dirname, 'media')

type Block = ['p' | 'h2', string]

const text = (t: string) => ({ type: 'text', text: t, detail: 0, format: 0, mode: 'normal', style: '', version: 1 })
const node = (type: 'paragraph' | 'heading', t: string) => ({
  type,
  ...(type === 'heading' ? { tag: 'h2' } : { textFormat: 0, textStyle: '' }),
  children: [text(t)],
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  version: 1,
})
/** Builds a Lexical rich text value from simple paragraphs and headings. */
const richText = (blocks: Block[]) => ({
  root: {
    type: 'root',
    children: blocks.map(([kind, t]) => node(kind === 'h2' ? 'heading' : 'paragraph', t)),
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})

const titleCase = (s: string) => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

async function seedMedia(payload: Payload) {
  const sources = Object.fromEntries(
    fs
      .readFileSync(path.join(mediaDir, 'SOURCES.txt'), 'utf8')
      .trim()
      .split('\n')
      .map((line) => line.split(' <- Dropbox: ')),
  )
  const ids: Record<string, number> = {}
  for (const file of fs.readdirSync(mediaDir).filter((f) => f.endsWith('.jpg'))) {
    const key = file.replace(/\.jpg$/, '')
    const existing = await payload.find({ collection: 'media', where: { filename: { equals: file } }, limit: 1 })
    if (existing.docs[0]) {
      ids[key] = existing.docs[0].id
      continue
    }
    const doc = await payload.create({
      collection: 'media',
      data: { alt: titleCase(key), source: 'dropbox', dropboxPath: sources[file] ?? null },
      filePath: path.join(mediaDir, file),
    })
    ids[key] = doc.id
  }
  return ids
}

async function upsertBySlug<T extends 'destinations' | 'lodges' | 'itineraries' | 'posts'>(
  payload: Payload,
  collection: T,
  slug: string,
  data: Record<string, unknown>,
) {
  const existing = await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1, draft: true })
  if (existing.docs[0]) return existing.docs[0].id as number
  const doc = await payload.create({ collection, data: { ...data, slug, _status: 'published' } as never })
  return doc.id as number
}

type Translatable = 'destinations' | 'lodges' | 'itineraries' | 'posts'

/** Adds the Norwegian version of a seeded document, unless it already has one. */
async function translateDoc(
  payload: Payload,
  collection: Translatable,
  slug: string,
  build: (en: Record<string, unknown>) => Record<string, unknown>,
) {
  const query = { collection, where: { slug: { equals: slug } }, limit: 1, depth: 0, draft: true } as const
  const [no, en] = await Promise.all([
    payload.find({ ...query, locale: 'no', fallbackLocale: false }),
    payload.find({ ...query, locale: 'en' }),
  ])
  const doc = no.docs[0] as unknown as Record<string, unknown> | undefined
  if (!doc || doc.summary || doc.excerpt) return
  await payload.update({
    collection,
    id: doc.id as number,
    locale: 'no',
    depth: 0,
    data: { ...build(en.docs[0] as unknown as Record<string, unknown>), _status: 'published' } as never,
  })
}

const slugOf = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
type Row = { id?: string | null } & Record<string, unknown>

async function addNorwegian(payload: Payload) {
  for (const [slug, d] of Object.entries(destinationsNo)) {
    await translateDoc(payload, 'destinations', slug, (en) => ({
      name: d.name ?? en.name,
      tagline: d.tagline,
      summary: d.summary,
      body: richText(d.body.map((p) => ['p', p] as Block)),
      highlights: ((en.highlights as Row[]) ?? []).map((row, i) => ({ id: row.id, text: d.highlights[i] ?? row.text })),
      ...(d.wildlife ? { wildlife: d.wildlife } : {}),
    }))
  }
  for (const [name, l] of Object.entries(lodgesNo)) {
    await translateDoc(payload, 'lodges', slugOf(name), () => ({ summary: l.summary, amenities: l.amenities }))
  }
  for (const [title, s] of Object.entries(itinerariesNo)) {
    await translateDoc(payload, 'itineraries', slugOf(title), (en) => ({
      title: s.title,
      summary: s.summary,
      days: ((en.days as Row[]) ?? []).map((row, i) => ({ ...row, ...(s.days[i] ?? {}) })),
      included: s.included,
      excluded: s.excluded,
    }))
  }
  for (const [title, p] of Object.entries(postsNo)) {
    await translateDoc(payload, 'posts', slugOf(title), () => ({
      title: p.title,
      excerpt: p.excerpt,
      body: richText(p.body),
    }))
  }

  const [homeNoDoc, homeEn] = await Promise.all([
    payload.findGlobal({ slug: 'home-page', locale: 'no', fallbackLocale: false, depth: 0, draft: true }),
    payload.findGlobal({ slug: 'home-page', locale: 'en', depth: 0, draft: true }),
  ])
  if (!homeNoDoc.heroSubheading && homeEn.heroSlides?.length) {
    const name = (await payload.findGlobal({ slug: 'expert-settings', depth: 0 })).expertName || 'Baraka'
    await payload.updateGlobal({
      slug: 'home-page',
      locale: 'no',
      depth: 0,
      data: {
        _status: 'published',
        heroSlides: homeEn.heroSlides.map((row, i) => ({ ...row, ...(homeNo.heroSlides[i] ?? {}) })),
        heroSubheading: homeNo.heroSubheading,
        intro: { ...homeEn.intro, ...homeNo.intro },
        pillars: (homeEn.pillars ?? []).map((row, i) => ({ ...row, ...(homeNo.pillars[i] ?? {}) })),
        expertBanner: {
          ...homeEn.expertBanner,
          heading: homeNo.expertBanner.heading(name),
          body: homeNo.expertBanner.body,
        },
      } as never,
    })
  }

  const siteNoDoc = await payload.findGlobal({ slug: 'site-settings', locale: 'no', fallbackLocale: false, depth: 0 })
  if (!siteNoDoc.footerNote) {
    await payload.updateGlobal({ slug: 'site-settings', locale: 'no', data: siteNo })
  }

  const [expertNoDoc, expertEn] = await Promise.all([
    payload.findGlobal({ slug: 'expert-settings', locale: 'no', fallbackLocale: false, depth: 0 }),
    payload.findGlobal({ slug: 'expert-settings', locale: 'en', depth: 0 }),
  ])
  // An untranslated greeting comes back as the English default, so compare with the English one.
  if (!expertNoDoc.greeting || expertNoDoc.greeting === expertEn.greeting) {
    await payload.updateGlobal({
      slug: 'expert-settings',
      locale: 'no',
      data: { expertTitle: expertNo.expertTitle, greeting: expertNo.greeting(expertNoDoc.expertName || 'Baraka') },
    })
  }
  payload.logger.info('Norwegian translations ready')
}

async function run() {
  const payload = await getPayload({ config })
  const media = await seedMedia(payload)
  const m = (key?: string) => (key ? media[key] : undefined)
  payload.logger.info(`Media ready: ${Object.keys(media).length} photos`)

  const destIds: Record<string, number> = {}
  for (const d of destinations) {
    destIds[d.slug] = await upsertBySlug(payload, 'destinations', d.slug, {
      name: d.name,
      region: d.region,
      type: d.type,
      order: d.order,
      tagline: d.tagline,
      heroImage: m(d.hero),
      gallery: d.gallery?.map(m).filter(Boolean),
      summary: d.summary,
      body: richText(d.body.map((p) => ['p', p] as Block)),
      highlights: d.highlights.map((t) => ({ text: t })),
      wildlife: d.wildlife,
      bestMonths: d.bestMonths,
      recommendedNights: d.recommendedNights,
      expertNotes: d.expertNotes,
    })
  }

  const lodgeIds: Record<string, number> = {}
  for (const l of lodges) {
    const slug = l.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    lodgeIds[l.name] = await upsertBySlug(payload, 'lodges', slug, {
      name: l.name,
      destination: destIds[l.destination],
      tier: l.tier,
      style: l.style,
      priceCode: l.name,
      heroImage: m(l.hero),
      summary: l.summary,
      amenities: l.amenities,
      featured: l.featured,
    })
  }

  const safariIds: number[] = []
  for (const s of itineraries) {
    const slug = s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    safariIds.push(
      await upsertBySlug(payload, 'itineraries', slug, {
        title: s.title,
        durationDays: s.durationDays,
        tier: s.tier,
        styles: s.styles,
        heroImage: m(s.hero),
        summary: s.summary,
        days: s.days.map((day) => ({
          dayRange: day.dayRange,
          title: day.title,
          destination: day.destination ? destIds[day.destination] : undefined,
          lodge: day.lodge ? lodgeIds[day.lodge] : undefined,
          nights: day.nights,
          description: day.description,
        })),
        included: s.included,
        excluded: s.excluded,
        featured: s.featured,
      }),
    )
  }

  for (const p of posts) {
    const slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    await upsertBySlug(payload, 'posts', slug, {
      title: p.title,
      author: p.author,
      heroImage: m(p.hero),
      excerpt: p.excerpt,
      body: richText(p.body as Block[]),
    })
  }

  const home = await payload.findGlobal({ slug: 'home-page', draft: true })
  if (!home.heroSlides?.length) {
    await payload.updateGlobal({
      slug: 'home-page',
      data: {
        _status: 'published',
        heroSlides: [
          { image: m('migration-game-drive')!, eyebrow: 'Serengeti · The Great Migration', heading: 'Follow the greatest show on earth' },
          { image: m('leopard-in-tree')!, eyebrow: 'Tailor-made Tanzania safaris', heading: 'Where the wild still roams free' },
          { image: m('kilimanjaro-sunrise')!, eyebrow: 'Mount Kilimanjaro', heading: 'Stand on the roof of Africa' },
          { image: m('dhow-sunset-zanzibar')!, eyebrow: 'Zanzibar & Mafia Island', heading: 'From the bush to the beach' },
        ],
        heroSubheading:
          'Safaris, climbs and beach holidays across Tanzania, planned by people who were born there and know every road, camp and season.',
        intro: {
          heading: 'Your choice. Your holiday. Our mission.',
          body:
            'All in Tanzania is a family business with roots in Tanzania and a home in Norway. Our founder grew up in Tanzania and ran a safari lodge in the Selous before starting the company; together with a team of local guides we have spent years in the parks, on the mountain and along the coast.\n\nEvery trip is tailor-made. Tell us what you dream of seeing and how you like to travel, and we will shape a journey around you, whether that is a camping adventure with the kids or a fly-in safari to the wildest corners of the south.',
          image: m('all-in-tanzania-safari-vehicle'),
        },
        featuredDestinations: ['serengeti', 'ngorongoro', 'ruaha', 'zanzibar', 'kilimanjaro', 'mafia-island'].map((s) => destIds[s]),
        featuredItineraries: safariIds.slice(0, 3),
        pillars: [
          { title: 'Local experts', body: 'Tanzanian guides and planners who know every park, camp and season first-hand.' },
          { title: 'Tailor-made', body: 'No fixed group tours. Every itinerary is built around your dates, budget and interests.' },
          { title: 'Families welcome', body: 'From Afrikidos camping adventures to beach days, we plan safaris children love.' },
          { title: 'Positive impact', body: 'We work with community and conservation projects such as the Ruaha Carnivore Project.' },
        ],
        expertBanner: {
          heading: 'Plan with Baraka, day or night',
          body:
            'Our AI safari expert has learned from our guides and planners and knows our parks, camps and seasons. Ask anything, type or talk, and shape your trip together. When you are ready, one of our team takes over personally.',
          image: m('bush-picnic'),
        },
      },
    })
  }

  const site = await payload.findGlobal({ slug: 'site-settings' })
  if (!site.email) {
    await payload.updateGlobal({
      slug: 'site-settings',
      data: {
        companyName: 'All in Tanzania',
        tagline: 'Your choice. Your holiday. Our mission.',
        email: 'info@allintanzania.com',
        phone: '+47 947 83 189',
        address: 'St. Olavs gate 18B\n3110 Tønsberg, Norway',
        footerNote: 'Tailor-made safaris, Kilimanjaro climbs and beach holidays across Tanzania, planned by people who call it home.',
        enquiryRecipients: ['info@allintanzania.com'],
      },
    })
  }

  const expert = await payload.findGlobal({ slug: 'expert-settings' })
  if (!expert.facts?.length) {
    await payload.updateGlobal({
      slug: 'expert-settings',
      data: {
        facts: [
          { fact: 'All in Tanzania is a family business run from Tanzania and Norway. The founder, Sele Mduda, is Tanzanian and previously worked as a lodge general manager in the Selous (now Nyerere).' },
          { fact: 'Every trip is tailor-made. We do safaris (northern and southern circuits), Kilimanjaro climbs, Zanzibar and Mafia Island beach holidays, family safaris (Afrikidos), golf safaris and motorbike safaris.' },
          { fact: 'All lodges we recommend are pre-qualified by our own team.' },
          { fact: 'Contact: info@allintanzania.com, phone/WhatsApp +47 947 83 189.' },
        ],
      },
    })
  }

  await addNorwegian(payload)

  const lists = await payload.count({ collection: 'price-lists' })
  if (!lists.totalDocs) {
    const file = path.join(dirname, '../../public/price-list-template.csv')
    const data = fs.readFileSync(file)
    const { rows } = await parsePriceFile(data, 'price-list-template.csv')
    await payload.create({
      collection: 'price-lists',
      data: { name: 'Sample rates (replace with your own)', active: true, rates: rows, rowCount: rows.length, parseErrors: [] },
      file: { data, name: 'price-list-template.csv', mimetype: 'text/csv', size: data.length },
    })
  }

  if (process.env.SEED_ADMIN_EMAIL) {
    const users = await payload.count({ collection: 'users' })
    if (users.totalDocs && process.env.RESET_ADMIN_PASSWORD) {
      const password = crypto.randomBytes(9).toString('base64url')
      const { docs } = await payload.update({
        collection: 'users',
        where: { email: { equals: process.env.SEED_ADMIN_EMAIL } },
        data: { password, loginAttempts: 0, lockUntil: null },
      })
      payload.logger.info(
        docs.length
          ? `New password for ${process.env.SEED_ADMIN_EMAIL}: ${password} (change it after logging in)`
          : `No user with the email ${process.env.SEED_ADMIN_EMAIL}`,
      )
    }
    if (!users.totalDocs) {
      const password = crypto.randomBytes(9).toString('base64url')
      await payload.create({
        collection: 'users',
        data: { email: process.env.SEED_ADMIN_EMAIL, password, name: 'Admin', roles: ['admin'] },
      })
      payload.logger.info(`Admin created: ${process.env.SEED_ADMIN_EMAIL} / ${password} (change it after first login)`)
    }
  }

  payload.logger.info('Seed complete')
  process.exit(0)
}

// `payload run` exits as soon as the module finishes loading, so wait for the seed here.
await run().catch((err) => {
  console.error(err)
  process.exit(1)
})
