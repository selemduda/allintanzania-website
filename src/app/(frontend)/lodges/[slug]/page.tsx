import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { TIER_LABEL } from '@/components/Cards'
import { Img } from '@/components/Img'
import { RichText } from '@/components/RichText'
import { rel } from '@/lib/format'
import { findBySlug } from '@/lib/payload'
import type { Destination } from '@/payload-types'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const l = await findBySlug('lodges', (await params).slug)
  return l ? { title: l.name, description: l.summary } : {}
}

export default async function LodgePage({ params }: Props) {
  const l = await findBySlug('lodges', (await params).slug)
  if (!l) notFound()
  const dest = rel<Destination>(l.destination)
  return (
    <>
      <section className="hero hero-short">
        <div className="hero-media">
          <Img media={l.heroImage} size="hero" priority />
        </div>
        <div className="container hero-content">
          <span className="eyebrow">{TIER_LABEL[l.tier]}{dest ? ` · ${dest.name}` : ''}</span>
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
                  <dt>Location</dt>
                  <dd><Link href={`/destinations/${dest.slug}`}>{dest.name}</Link></dd>
                </>
              )}
              <dt>Level</dt>
              <dd>{TIER_LABEL[l.tier]}</dd>
              {l.amenities && l.amenities.length > 0 && (
                <>
                  <dt>Highlights</dt>
                  <dd>{l.amenities.join(' · ')}</dd>
                </>
              )}
            </dl>
            {dest && (
              <Link href={`/plan?add=${dest.slug}&tier=${l.tier}`} className="btn btn-primary">Add to my dream trip</Link>
            )}
            <Link href={`/expert?about=${encodeURIComponent(l.name)}`} className="btn btn-ghost">Ask our expert</Link>
          </aside>
        </div>
      </section>
    </>
  )
}
