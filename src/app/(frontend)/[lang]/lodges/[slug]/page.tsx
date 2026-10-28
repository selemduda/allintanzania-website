import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { Img } from '@/components/Img'
import { RichText } from '@/components/RichText'
import { rel } from '@/lib/format'
import { getDict, localePath } from '@/lib/i18n'
import { pageLang } from '@/lib/pageLang'
import { findBySlug } from '@/lib/payload'
import type { Destination } from '@/payload-types'
import { pageMeta } from '@/lib/seo'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ lang: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await pageLang(params)
  const l = await findBySlug('lodges', (await params).slug, lang)
  return l ? pageMeta({ lang, path: `/lodges/${l.slug}`, title: l.name, description: l.summary, image: l.heroImage }) : {}
}

export default async function LodgePage({ params }: Props) {
  const lang = await pageLang(params)
  const t = getDict(lang)
  const l = await findBySlug('lodges', (await params).slug, lang)
  if (!l) notFound()
  const dest = rel<Destination>(l.destination)
  return (
    <>
      <section className="hero hero-short">
        <div className="hero-media">
          <Img media={l.heroImage} size="hero" priority />
        </div>
        <div className="container hero-content">
          <span className="eyebrow">{t.tiers[l.tier]}{dest ? ` · ${dest.name}` : ''}</span>
          <h1>{l.name}</h1>
        </div>
      </section>
      <section className="section">
        <div className="container detail-grid">
          <div>
            <p className="lead">{l.summary}</p>
            <RichText data={l.body} />
            {l.gallery && l.gallery.length > 0 && (
              <div className="gallery" style={{ marginTop: 40 }}>
                {l.gallery.map((m, i) => (
                  <div key={typeof m === 'object' ? m.id : i}>
                    <Img media={m} size="card" sizes="33vw" />
                  </div>
                ))}
              </div>
            )}
          </div>
          <aside className="detail-aside">
            <dl>
              {dest && (
                <>
                  <dt>{t.lodges.location}</dt>
                  <dd><Link href={localePath(lang, `/destinations/${dest.slug}`)}>{dest.name}</Link></dd>
                </>
              )}
              <dt>{t.lodges.level}</dt>
              <dd>{t.tiers[l.tier]}</dd>
              {l.amenities && l.amenities.length > 0 && (
                <>
                  <dt>{t.lodges.highlights}</dt>
                  <dd>{l.amenities.join(' · ')}</dd>
                </>
              )}
            </dl>
            {dest && (
              <Link href={localePath(lang, `/plan?add=${dest.slug}&tier=${l.tier}`)} className="btn btn-primary">{t.addToTrip}</Link>
            )}
            <Link href={localePath(lang, `/expert?about=${encodeURIComponent(l.name)}`)} className="btn btn-ghost">{t.askExpert}</Link>
          </aside>
        </div>
      </section>
    </>
  )
}
