import type { Metadata } from 'next'
import React from 'react'

import { TripBuilder, type BuilderDestination } from '@/components/TripBuilder'
import { mediaPath } from '@/lib/format'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Build your dream safari',
  description: 'Choose your parks, nights and style of lodge and get an instant price estimate.',
}

type Props = { searchParams: Promise<{ add?: string; route?: string; tier?: string }> }

export default async function PlanPage({ searchParams }: Props) {
  const params = await searchParams
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'destinations',
    where: { _status: { equals: 'published' } },
    sort: 'order',
    limit: 100,
    depth: 1,
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
        <span className="eyebrow">Trip builder</span>
        <h1>Build your dream safari</h1>
        <p className="lead">
          Pick the places you want to see, how long to stay and how you like to sleep. Your estimate updates as you go, then one of our experts turns it into a real itinerary.
        </p>
      </section>
      <section className="container" style={{ paddingBottom: 110 }}>
        <TripBuilder
          destinations={destinations}
          initialStops={initialStops}
          initialTier={tier as 'comfort' | 'classic' | 'luxury'}
        />
      </section>
    </>
  )
}
