import Link from 'next/link'
import React from 'react'

import { Img } from '@/components/Img'
import { rel, usd } from '@/lib/format'
import { getDict, localePath, type Lang } from '@/lib/i18n'
import { getShowPrices } from '@/lib/payload'
import type { Destination, Itinerary, Lodge } from '@/payload-types'

export function DestinationTile({ d, wide, lang }: { d: Destination; wide?: boolean; lang: Lang }) {
  return (
    <Link href={localePath(lang, `/destinations/${d.slug}`)} className={`tile ${wide ? 'tile-wide' : ''}`}>
      <Img media={d.heroImage} size="card" sizes="(max-width: 640px) 100vw, 33vw" />
      <div className="tile-text">
        <h3>{d.name}</h3>
        {d.tagline && <p>{d.tagline}</p>}
      </div>
    </Link>
  )
}

export async function SafariCard({ s, lang }: { s: Itinerary; lang: Lang }) {
  const price = (await getShowPrices()) ? s.fromPrice : null
  const t = getDict(lang)
  return (
    <Link href={localePath(lang, `/safaris/${s.slug}`)} className="card">
      <div className="card-media">
        <Img media={s.heroImage} size="card" sizes="(max-width: 640px) 100vw, 33vw" />
      </div>
      <div className="card-body">
        <span className="eyebrow" style={{ marginBottom: 0 }}>
          {t.days(s.durationDays)}{s.tier ? ` · ${t.tiers[s.tier]}` : ''}
        </span>
        <h3>{s.title}</h3>
        <p>{s.summary}</p>
        <div className="card-meta">
          <span>{price ? t.cards.fromPerPerson : t.cards.onRequest}</span>
          {price ? <strong>{usd(price)}</strong> : <span className="link-arrow">{t.cards.view}</span>}
        </div>
      </div>
    </Link>
  )
}

export function LodgeCard({ l, lang }: { l: Lodge; lang: Lang }) {
  const dest = rel(l.destination)
  return (
    <Link href={localePath(lang, `/lodges/${l.slug}`)} className="card">
      <div className="card-media">
        <Img media={l.heroImage} size="card" sizes="(max-width: 640px) 100vw, 33vw" />
      </div>
      <div className="card-body">
        <div className="pill-row">
          <span className="pill">{getDict(lang).tiers[l.tier] ?? l.tier}</span>
          {dest && <span className="pill">{dest.name}</span>}
        </div>
        <h3>{l.name}</h3>
        <p>{l.summary}</p>
      </div>
    </Link>
  )
}

