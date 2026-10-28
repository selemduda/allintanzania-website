import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { DestinationTile } from '@/components/Cards'
import { getPayloadClient } from '@/lib/payload'
import { pageMeta } from '@/lib/seo'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = pageMeta({
  path: '/destinations',
  title: 'Destinations',
  description: 'Serengeti, Ngorongoro, Tarangire, Ruaha, Nyerere (Selous), Kilimanjaro and Zanzibar: where to go on safari in Tanzania.',
})

const REGIONS = [
  { value: '', label: 'All' },
  { value: 'northern', label: 'Northern Circuit' },
  { value: 'southern', label: 'Southern & Western' },
  { value: 'coast', label: 'Coast & Islands' },
  { value: 'mountains', label: 'Mountains' },
]

export default async function DestinationsPage({ searchParams }: { searchParams: Promise<{ region?: string }> }) {
  const { region = '' } = await searchParams
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'destinations',
    where: { _status: { equals: 'published' }, ...(region ? { region: { equals: region } } : {}) },
    sort: 'order',
    limit: 100,
  })
  return (
    <>
      <section className="container page-intro">
        <span className="eyebrow">Destinations</span>
        <h1>Tanzania, park by park</h1>
        <p className="lead">
          A quarter of Tanzania is protected wilderness. Here is where we take our guests, and why each place is worth the journey.
        </p>
      </section>
      <section className="container" style={{ paddingBottom: 100 }}>
        <nav className="filters" aria-label="Filter by region">
          {REGIONS.map((r) => (
            <Link key={r.value} href={r.value ? `?region=${r.value}` : '/destinations'} className={region === r.value ? 'active' : ''}>
              {r.label}
            </Link>
          ))}
        </nav>
        <div className="grid grid-3">
          {docs.map((d) => <DestinationTile key={d.id} d={d} />)}
        </div>
        {!docs.length && <p className="muted">No destinations here yet.</p>}
      </section>
    </>
  )
}
