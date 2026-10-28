import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { Img } from '@/components/Img'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Journal' }

export default async function JournalPage() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 50,
  })
  return (
    <>
      <section className="container page-intro">
        <span className="eyebrow">Journal</span>
        <h1>Stories from the bush</h1>
        <p className="lead">Field notes, wildlife sightings and travel advice from our guides.</p>
      </section>
      <section className="container" style={{ paddingBottom: 100 }}>
        <div className="grid grid-3">
          {docs.map((p) => (
            <Link key={p.id} href={`/journal/${p.slug}`} className="card">
              <div className="card-media">
                <Img media={p.heroImage} size="card" sizes="33vw" />
              </div>
              <div className="card-body">
                {p.publishedAt && (
                  <span className="muted" style={{ fontSize: '0.85rem' }}>
                    {new Date(p.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                )}
                <h3>{p.title}</h3>
                {p.excerpt && <p>{p.excerpt}</p>}
              </div>
            </Link>
          ))}
        </div>
        {!docs.length && <p className="muted">The first stories are on their way.</p>}
      </section>
    </>
  )
}
