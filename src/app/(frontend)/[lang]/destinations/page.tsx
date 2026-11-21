import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { DestinationTile } from '@/components/Cards'
import { getDict, localePath } from '@/lib/i18n'
import { pageLang } from '@/lib/pageLang'
import { getPayloadClient } from '@/lib/payload'
import { pageMeta } from '@/lib/seo'

export const dynamic = 'force-dynamic'

const REGIONS = ['', 'northern', 'southern', 'coast', 'mountains']

type Props = { params: Promise<{ lang: string }>; searchParams: Promise<{ region?: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await pageLang(params)
  const t = getDict(lang).destinations
  return pageMeta({ lang, path: '/destinations', title: t.title, description: t.description })
}

export default async function DestinationsPage({ params, searchParams }: Props) {
  const lang = await pageLang(params)
  const t = getDict(lang)
  const { region = '' } = await searchParams
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'destinations',
    where: { _status: { equals: 'published' }, ...(region ? { region: { equals: region } } : {}) },
    sort: 'order',
    limit: 100,
    locale: lang,
  })
  return (
    <>
      <section className="container page-intro">
        <span className="eyebrow">{t.nav.destinations}</span>
        <h1>{t.destinations.heading}</h1>
        <p className="lead">{t.destinations.lead}</p>
      </section>
      <section className="container" style={{ paddingBottom: 100 }}>
        <nav className="filters" aria-label={t.destinations.filter}>
          {REGIONS.map((r) => (
            <Link key={r} href={r ? `?region=${r}` : localePath(lang, '/destinations')} className={region === r ? 'active' : ''}>
              {t.regions[r]}
            </Link>
          ))}
        </nav>
        <div className="grid grid-3">
          {docs.map((d) => <DestinationTile key={d.id} d={d} lang={lang} />)}
        </div>
        {!docs.length && <p className="muted">{t.destinations.none}</p>}
      </section>
    </>
  )
}
