import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { SafariCard } from '@/components/Cards'
import { TRIP_STYLES } from '@/collections/Itineraries'
import { getPayloadClient } from '@/lib/payload'
import { pageMeta } from '@/lib/seo'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = pageMeta({
  path: '/safaris',
  title: 'Safaris',
  description: 'Tailor-made Tanzania safari itineraries: the Great Migration, family safaris, beach and bush, and southern parks.',
})

export default async function SafarisPage({ searchParams }: { searchParams: Promise<{ style?: string }> }) {
  const { style = '' } = await searchParams
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'itineraries',
    where: { _status: { equals: 'published' }, ...(style ? { styles: { contains: style } } : {}) },
    sort: 'durationDays',
    limit: 100,
  })
  return (
    <>
      <section className="container page-intro">
        <span className="eyebrow">Safaris</span>
        <h1>Sample journeys</h1>
        <p className="lead">
          Every safari we plan is tailor-made. Use these as a starting point, then change anything: the parks, the pace, the camps, the budget.
        </p>
      </section>
      <section className="container" style={{ paddingBottom: 100 }}>
        <nav className="filters" aria-label="Filter by style">
          <Link href="/safaris" className={!style ? 'active' : ''}>All</Link>
          {TRIP_STYLES.map((s) => (
            <Link key={s.value} href={`?style=${s.value}`} className={style === s.value ? 'active' : ''}>
              {s.label}
            </Link>
          ))}
        </nav>
        <div className="grid grid-3">
          {docs.map((s) => <SafariCard key={s.id} s={s} />)}
        </div>
        {!docs.length && <p className="muted">No safaris in this style yet. <Link href="/plan">Build your own</Link>.</p>}
      </section>
    </>
  )
}
