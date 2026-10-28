import Link from 'next/link'
import React from 'react'

import { Img } from '@/components/Img'
import { rel, usd } from '@/lib/format'
import { getShowPrices } from '@/lib/payload'
import type { Destination, Itinerary, Lodge } from '@/payload-types'

const TIER_LABEL: Record<string, string> = { comfort: 'Comfort', classic: 'Classic', luxury: 'Luxury' }

export function DestinationTile({ d, wide }: { d: Destination; wide?: boolean }) {
  return (
    <Link href={`/destinations/${d.slug}`} className={`tile ${wide ? 'tile-wide' : ''}`}>
      <Img media={d.heroImage} size="card" sizes="(max-width: 640px) 100vw, 33vw" />
      <div className="tile-text">
        <h3>{d.name}</h3>
        {d.tagline && <p>{d.tagline}</p>}
      </div>
    </Link>
  )
}

export async function SafariCard({ s }: { s: Itinerary }) {
  const price = (await getShowPrices()) ? s.fromPrice : null
  return (
    <Link href={`/safaris/${s.slug}`} className="card">
      <div className="card-media">
        <Img media={s.heroImage} size="card" sizes="(max-width: 640px) 100vw, 33vw" />
      </div>
      <div className="card-body">
        <span className="eyebrow" style={{ marginBottom: 0 }}>
          {s.durationDays} days{s.tier ? ` · ${TIER_LABEL[s.tier]}` : ''}
        </span>
        <h3>{s.title}</h3>
        <p>{s.summary}</p>
        <div className="card-meta">
          <span>{price ? 'From, per person' : 'Tailor-made · price on request'}</span>
          {price ? <strong>{usd(price)}</strong> : <span className="link-arrow">View</span>}
        </div>
      </div>
    </Link>
  )
}

export function LodgeCard({ l }: { l: Lodge }) {
  const dest = rel(l.destination)
  return (
    <Link href={`/lodges/${l.slug}`} className="card">
      <div className="card-media">
        <Img media={l.heroImage} size="card" sizes="(max-width: 640px) 100vw, 33vw" />
      </div>
      <div className="card-body">
        <div className="pill-row">
          <span className="pill">{TIER_LABEL[l.tier] ?? l.tier}</span>
          {dest && <span className="pill">{dest.name}</span>}
        </div>
        <h3>{l.name}</h3>
        <p>{l.summary}</p>
      </div>
    </Link>
  )
}

export { TIER_LABEL }
