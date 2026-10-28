import type { Metadata } from 'next'
import React from 'react'

import { TripBuilder, type BuilderDestination } from '@/components/TripBuilder'
import { mediaPath } from '@/lib/format'
import { getDict } from '@/lib/i18n'
import { pageLang } from '@/lib/pageLang'
import { getPayloadClient, getShowPrices } from '@/lib/payload'
import { pageMeta } from '@/lib/seo'

export const dynamic = 'force-dynamic'
type Props = {
  params: Promise<{ lang: string }>
  searchParams: Promise<{ add?: string; route?: string; tier?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await pageLang(params)
  const t = getDict(lang).plan
  return pageMeta({ lang, path: '/plan', title: t.title, description: t.description })
}

export default async function PlanPage({ params: routeParams, searchParams }: Props) {
  const lang = await pageLang(routeParams)
  const t = getDict(lang)
  const params = await searchParams
  const payload = await getPayloadClient()
  const showPrices = await getShowPrices()
  const { docs } = await payload.find({
    collection: 'destinations',
    where: { _status: { equals: 'published' } },
    sort: 'order',
    limit: 100,
    depth: 1,
    locale: lang,
  })
  const destinations: BuilderDestination[] = docs.map((d) => ({
    slug: d.slug ?? String(d.id),
    name: d.name,
    tagline: d.tagline ?? '',
    region: d.region ?? '',
    nights: d.recommendedNights ?? 2,
    image:
      d.heroImage && typeof d.heroImage === 'object'
        ? mediaPath(d.heroImage.sizes?.thumbnail?.url ?? d.heroImage.url)
        : null,
  }))

  // Pre-fill from links such as /plan?add=serengeti or /plan?route=tarangire:2,serengeti:3
  const known = new Set(destinations.map((d) => d.slug))
  const initialStops = (params.route ?? params.add ?? '')
    .split(',')
    .map((part) => {
      const [slug, nights] = part.split(':')
      const dest = destinations.find((d) => d.slug === slug)
      return dest ? { destination: slug, nights: Number(nights) || dest.nights } : null
    })
    .filter((s): s is { destination: string; nights: number } => Boolean(s && known.has(s.destination)))
  const tier = ['comfort', 'classic', 'luxury'].includes(params.tier ?? '') ? params.tier : 'classic'

  return (
    <>
      <section className="container page-intro">
        <span className="eyebrow">{t.plan.eyebrow}</span>
        <h1>{t.plan.title}</h1>
        <p className="lead">{t.plan.lead(showPrices)}</p>
      </section>
      <section className="container" style={{ paddingBottom: 110 }}>
        <TripBuilder
          destinations={destinations}
          initialStops={initialStops}
          initialTier={tier as 'comfort' | 'classic' | 'luxury'}
          showPrices={showPrices}
          lang={lang}
        />
      </section>
    </>
  )
}
