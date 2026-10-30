import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { Img } from '@/components/Img'
import { mediaPath, rel, usd } from '@/lib/format'
import { getDict, localePath } from '@/lib/i18n'
import { pageLang } from '@/lib/pageLang'
import { findBySlug, getShowPrices } from '@/lib/payload'
import type { Destination, Lodge, Media } from '@/payload-types'
import { jsonLd, pageMeta, shareImage, siteUrl } from '@/lib/seo'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ lang: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await pageLang(params)
  const s = await findBySlug('itineraries', (await params).slug, lang)
  return s ? pageMeta({ lang, path: `/safaris/${s.slug}`, title: s.title, description: s.summary, image: s.heroImage }) : {}
}

export default async function SafariPage({ params }: Props) {
  const lang = await pageLang(params)
  const t = getDict(lang)
  const s = await findBySlug('itineraries', (await params).slug, lang)
  const showPrices = await getShowPrices()
  if (!s) notFound()
  const video = rel<Media>(s.video)
  const poster = rel<Media>(s.heroImage)
  const route = (s.days ?? [])
    .filter((day) => rel<Destination>(day.destination) && (day.nights ?? 0) > 0)
    .map((day) => `${rel<Destination>(day.destination)!.slug}:${day.nights}`)
    .join(',')
  const trip = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: s.title,
    description: s.summary,
    url: siteUrl() + localePath(lang, `/safaris/${s.slug}`),
    inLanguage: lang === 'no' ? 'nb' : 'en',
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
          <span className="eyebrow">{t.safaris.daySafari(s.durationDays)}</span>
          <h1>{s.title}</h1>
        </div>
      </section>

      <section className="section">
        <div className="container detail-grid">
          <div>
            <p className="lead">{s.summary}</p>
            {video?.url && (
              <video
                className="trip-video"
                src={mediaPath(video.url)!}
                poster={mediaPath(poster?.sizes?.hero?.url || poster?.url) ?? undefined}
                controls
                playsInline
                preload="metadata"
                aria-label={video.alt ?? undefined}
              />
            )}
            <h2 style={{ marginTop: 48 }}>{t.safaris.dayByDay}</h2>
            <ol className="timeline">
              {(s.days ?? []).map((day) => {
                const dest = rel<Destination>(day.destination)
                const lodge = rel<Lodge>(day.lodge)
                return (
                  <li key={day.id}>
                    <span className="day">{day.dayRange}</span>
                    <h3>{day.title}</h3>
                    <div className="where">
                      {dest && <Link href={localePath(lang, `/destinations/${dest.slug}`)}>{dest.name}</Link>}
                      {lodge && <> · <Link href={localePath(lang, `/lodges/${lodge.slug}`)}>{lodge.name}</Link></>}
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
                    <h3>{t.safaris.included}</h3>
                    <ul className="highlights">{s.included.map((x) => <li key={x}>{x}</li>)}</ul>
                  </div>
                )}
                {s.excluded && s.excluded.length > 0 && (
                  <div>
                    <h3>{t.safaris.notIncluded}</h3>
                    <ul className="highlights">{s.excluded.map((x) => <li key={x}>{x}</li>)}</ul>
                  </div>
                )}
              </div>
            ) : null}
            {s.gallery && s.gallery.length > 0 && (
              <div className="gallery" style={{ marginTop: 40 }}>
                {s.gallery.map((m, i) => (
                  <div key={typeof m === 'object' ? m.id : i}>
                    <Img media={m} size="card" sizes="33vw" />
                  </div>
                ))}
              </div>
            )}
          </div>
          <aside className="detail-aside">
            <dl>
              <dt>{t.safaris.duration}</dt>
              <dd>{t.days(s.durationDays)}</dd>
              {s.tier && (
                <>
                  <dt>{t.safaris.style}</dt>
                  <dd>{t.tiers[s.tier]}</dd>
                </>
              )}
              <dt>{showPrices && s.fromPrice ? t.safaris.from : t.safaris.price}</dt>
              {showPrices && s.fromPrice ? (
                <dd style={{ fontSize: '1.6rem', fontFamily: 'var(--serif)' }}>
                  {usd(s.fromPrice)} <small className="muted">{t.safaris.perPerson}</small>
                </dd>
              ) : (
                <dd>{t.safaris.onRequest}</dd>
              )}
            </dl>
            <Link href={localePath(lang, `/plan?route=${route}&tier=${s.tier ?? 'classic'}`)} className="btn btn-primary">
              {showPrices ? t.safaris.customisePrice : t.safaris.customise}
            </Link>
            <Link href={localePath(lang, `/expert?about=${encodeURIComponent(s.title)}`)} className="btn btn-ghost">{t.askExpert}</Link>
          </aside>
        </div>
      </section>
    </>
  )
}
