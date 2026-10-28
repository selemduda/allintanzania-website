import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { LodgeCard } from '@/components/Cards'
import { TIERS } from '@/collections/Lodges'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Lodges & Camps' }

export default async function LodgesPage({ searchParams }: { searchParams: Promise<{ tier?: string }> }) {
  const { tier = '' } = await searchParams
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'lodges',
    where: { _status: { equals: 'published' }, ...(tier ? { tier: { equals: tier } } : {}) },
    sort: 'name',
    limit: 200,
    depth: 1,
  })
  return (
    <>
      <section className="container page-intro">
        <span className="eyebrow">Lodges & Camps</span>
        <h1>Places we trust</h1>
        <p className="lead">
          We have slept in every camp we recommend. From simple, friendly tented camps to the finest lodges on the Serengeti, chosen for location, guiding and hospitality.
        </p>
      </section>
      <section className="container" style={{ paddingBottom: 100 }}>
        <nav className="filters" aria-label="Filter by level">
          <Link href="/lodges" className={!tier ? 'active' : ''}>All</Link>
          {TIERS.map((t) => (
            <Link key={t.value} href={`?tier=${t.value}`} className={tier === t.value ? 'active' : ''}>
              {t.label}
            </Link>
          ))}
        </nav>
        <div className="grid grid-3">
          {docs.map((l) => <LodgeCard key={l.id} l={l} />)}
        </div>
        {!docs.length && <p className="muted">No lodges here yet.</p>}
      </section>
    </>
  )
}
