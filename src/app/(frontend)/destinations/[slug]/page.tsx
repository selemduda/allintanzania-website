import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { LodgeCard, SafariCard } from '@/components/Cards'
import { Img } from '@/components/Img'
import { RichText } from '@/components/RichText'
import { MONTHS } from '@/collections/Destinations'
import { findBySlug, getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const d = await findBySlug('destinations', (await params).slug)
  return d ? { title: d.name, description: d.summary } : {}
}

export default async function DestinationPage({ params }: Props) {
  const d = await findBySlug('destinations', (await params).slug)
  if (!d) notFound()
  const payload = await getPayloadClient()
  const [lodges, safaris] = await Promise.all([
    payload.find({
      collection: 'lodges',
      where: { destination: { equals: d.id }, _status: { equals: 'published' } },
      limit: 6,
    }),
    payload.find({
      collection: 'itineraries',
      where: { 'days.destination': { equals: d.id }, _status: { equals: 'published' } },
      limit: 3,
    }),
  ])

  return (
    <>
      <section className="hero hero-short">
        <div className="hero-media">
          <Img media={d.heroImage} size="hero" priority />
        </div>
        <div className="container hero-content">
          <span className="eyebrow">Destination</span>
          <h1>{d.name}</h1>
          {d.tagline && <p className="lead">{d.tagline}</p>}
        </div>
      </section>

      <section className="section">
        <div className="container detail-grid">
          <div>
            <p className="lead">{d.summary}</p>
            {d.highlights && d.highlights.length > 0 && (
              <>
                <h3>Highlights</h3>
                <ul className="highlights">
                  {d.highlights.map((h) => <li key={h.id}>{h.text}</li>)}
                </ul>
              </>
            )}
            <RichText data={d.body} />
            {d.gallery && d.gallery.length > 0 && (
              <div className="gallery" style={{ marginTop: 40 }}>
                {d.gallery.map((m, i) => (
                  <div key={typeof m === 'object' ? m.id : i}>
                    <Img media={m} size="card" sizes="33vw" />
                  </div>
                ))}
              </div>
            )}
          </div>
          <aside className="detail-aside">
            <dl>
              {d.wildlife && d.wildlife.length > 0 && (
                <>
                  <dt>Wildlife</dt>
                  <dd>{d.wildlife.join(', ')}</dd>
                </>
              )}
              {d.recommendedNights ? (
                <>
                  <dt>Suggested stay</dt>
                  <dd>{d.recommendedNights} nights</dd>
                </>
              ) : null}
              {d.bestMonths && d.bestMonths.length > 0 && (
                <>
                  <dt>Best time to visit</dt>
                  <dd>
                    <div className="months">
                      {MONTHS.map((m) => (
                        <span key={m} className={d.bestMonths?.includes(m) ? 'on' : ''}>{m[0]}</span>
                      ))}
                    </div>
                  </dd>
                </>
              )}
            </dl>
            <Link href={`/plan?add=${d.slug}`} className="btn btn-primary">Add to my dream trip</Link>
            <Link href={`/expert?about=${encodeURIComponent(d.name)}`} className="btn btn-ghost">Ask our expert</Link>
          </aside>
        </div>
      </section>

      {lodges.docs.length > 0 && (
        <section className="section section-sand">
          <div className="container">
            <div className="section-head">
              <h2>Where to stay in {d.name}</h2>
            </div>
            <div className="grid grid-3">
              {lodges.docs.map((l) => <LodgeCard key={l.id} l={l} />)}
            </div>
          </div>
        </section>
      )}

      {safaris.docs.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <h2>Safaris that visit {d.name}</h2>
            </div>
            <div className="grid grid-3">
              {safaris.docs.map((s) => <SafariCard key={s.id} s={s} />)}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
