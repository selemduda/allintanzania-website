import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { TIER_LABEL } from '@/components/Cards'
import { Img } from '@/components/Img'
import { rel, usd } from '@/lib/format'
import { findBySlug, getShowPrices } from '@/lib/payload'
import type { Destination, Lodge } from '@/payload-types'
import { jsonLd, pageMeta, shareImage, siteUrl } from '@/lib/seo'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = await findBySlug('itineraries', (await params).slug)
  return s ? pageMeta({ path: `/safaris/${s.slug}`, title: s.title, description: s.summary, image: s.heroImage }) : {}
}

export default async function SafariPage({ params }: Props) {
  const s = await findBySlug('itineraries', (await params).slug)
  const showPrices = await getShowPrices()
  if (!s) notFound()
  const route = (s.days ?? [])
    .filter((day) => rel<Destination>(day.destination) && (day.nights ?? 0) > 0)
    .map((day) => `${rel<Destination>(day.destination)!.slug}:${day.nights}`)
    .join(',')
  const trip = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: s.title,
    description: s.summary,
    url: `${siteUrl()}/safaris/${s.slug}`,
    image: shareImage(s.heroImage),
    touristType: 'Safari',
    provider: { '@type': 'TravelAgency', name: 'All in Tanzania', url: siteUrl() },
    itinerary: {
      '@type': 'ItemList',
      itemListElement: (s.days ?? []).map((day, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: { '@type': 'TouristAttraction', name: rel<Destination>(day.destination)?.name ?? day.title },
      })),
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(trip)} />
      <section className="hero hero-short">
        <div className="hero-media">
          <Img media={s.heroImage} size="hero" priority />
        </div>
        <div className="container hero-content">
          <span className="eyebrow">{s.durationDays} day safari</span>
          <h1>{s.title}</h1>
        </div>
      </section>

      <section className="section">
        <div className="container detail-grid">
          <div>
            <p className="lead">{s.summary}</p>
            <h2 style={{ marginTop: 48 }}>Day by day</h2>
            <ol className="timeline">
              {(s.days ?? []).map((day) => {
                const dest = rel<Destination>(day.destination)
                const lodge = rel<Lodge>(day.lodge)
                return (
                  <li key={day.id}>
                    <span className="day">{day.dayRange}</span>
                    <h3>{day.title}</h3>
                    <div className="where">
                      {dest && <Link href={`/destinations/${dest.slug}`}>{dest.name}</Link>}
                      {lodge && <> · <Link href={`/lodges/${lodge.slug}`}>{lodge.name}</Link></>}
                    </div>
                    {day.description && <p>{day.description}</p>}
                  </li>
                )
              })}
            </ol>
            {(s.included?.length || s.excluded?.length) ? (
              <div className="grid grid-2" style={{ marginTop: 24 }}>
                {s.included && s.included.length > 0 && (
                  <div>
                    <h3>Included</h3>
                    <ul className="highlights">{s.included.map((x) => <li key={x}>{x}</li>)}</ul>
                  </div>
                )}
                {s.excluded && s.excluded.length > 0 && (
                  <div>
                    <h3>Not included</h3>
                    <ul className="highlights">{s.excluded.map((x) => <li key={x}>{x}</li>)}</ul>
                  </div>
                )}
              </div>
            ) : null}
          </div>
          <aside className="detail-aside">
            <dl>
              <dt>Duration</dt>
              <dd>{s.durationDays} days</dd>
              {s.tier && (
                <>
                  <dt>Style</dt>
                  <dd>{TIER_LABEL[s.tier]}</dd>
                </>
              )}
              <dt>{showPrices && s.fromPrice ? 'From' : 'Price'}</dt>
              {showPrices && s.fromPrice ? (
                <dd style={{ fontSize: '1.6rem', fontFamily: 'var(--serif)' }}>
                  {usd(s.fromPrice)} <small className="muted">per person</small>
                </dd>
              ) : (
                <dd>On request</dd>
              )}
            </dl>
            <Link href={`/plan?route=${route}&tier=${s.tier ?? 'classic'}`} className="btn btn-primary">
              {showPrices ? 'Customise & price this trip' : 'Customise this trip'}
            </Link>
            <Link href={`/expert?about=${encodeURIComponent(s.title)}`} className="btn btn-ghost">Ask our expert</Link>
          </aside>
        </div>
      </section>
    </>
  )
}
