import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { LodgeCard, SafariCard } from '@/components/Cards'
import { Img } from '@/components/Img'
import { RichText } from '@/components/RichText'
import { MONTHS } from '@/collections/Destinations'
import { getDict, localePath } from '@/lib/i18n'
import { pageLang } from '@/lib/pageLang'
import { findBySlug, getPayloadClient } from '@/lib/payload'
import { pageMeta } from '@/lib/seo'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ lang: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await pageLang(params)
  const d = await findBySlug('destinations', (await params).slug, lang)
  return d ? pageMeta({ lang, path: `/destinations/${d.slug}`, title: d.name, description: d.summary, image: d.heroImage }) : {}
}

export default async function DestinationPage({ params }: Props) {
  const lang = await pageLang(params)
  const t = getDict(lang)
  const d = await findBySlug('destinations', (await params).slug, lang)
  if (!d) notFound()
  const payload = await getPayloadClient()
  const [lodges, safaris] = await Promise.all([
    payload.find({
      collection: 'lodges',
      where: { destination: { equals: d.id }, _status: { equals: 'published' } },
      limit: 6,
      locale: lang,
    }),
    payload.find({
      collection: 'itineraries',
      where: { 'days.destination': { equals: d.id }, _status: { equals: 'published' } },
      limit: 3,
      locale: lang,
    }),
  ])

  return (
    <>
      <section className="hero hero-short">
        <div className="hero-media">
          <Img media={d.heroImage} size="hero" priority />
        </div>
        <div className="container hero-content">
          <span className="eyebrow">{t.destinations.eyebrow}</span>
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
                <h3>{t.destinations.highlights}</h3>
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
                  <dt>{t.destinations.wildlife}</dt>
                  <dd>{d.wildlife.join(', ')}</dd>
                </>
              )}
              {d.recommendedNights ? (
                <>
                  <dt>{t.destinations.suggestedStay}</dt>
                  <dd>{t.nights(d.recommendedNights)}</dd>
                </>
              ) : null}
              {d.bestMonths && d.bestMonths.length > 0 && (
                <>
                  <dt>{t.destinations.bestTime}</dt>
                  <dd>
                    <div className="months">
                      {MONTHS.map((m, i) => (
                        <span key={m} className={d.bestMonths?.includes(m) ? 'on' : ''} title={t.months[i]}>{m[0]}</span>
                      ))}
                    </div>
                  </dd>
                </>
              )}
            </dl>
            <Link href={localePath(lang, `/plan?add=${d.slug}`)} className="btn btn-primary">{t.addToTrip}</Link>
            <Link href={localePath(lang, `/expert?about=${encodeURIComponent(d.name)}`)} className="btn btn-ghost">{t.askExpert}</Link>
          </aside>
        </div>
      </section>

      {lodges.docs.length > 0 && (
        <section className="section section-sand">
          <div className="container">
            <div className="section-head">
              <h2>{t.destinations.whereToStay(d.name)}</h2>
            </div>
            <div className="grid grid-3">
              {lodges.docs.map((l) => <LodgeCard key={l.id} l={l} lang={lang} />)}
            </div>
          </div>
        </section>
      )}

      {safaris.docs.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <h2>{t.destinations.safarisVisiting(d.name)}</h2>
            </div>
            <div className="grid grid-3">
              {safaris.docs.map((s) => <SafariCard key={s.id} s={s} lang={lang} />)}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
