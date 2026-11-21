import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { SafariCard } from '@/components/Cards'
import { TRIP_STYLES } from '@/collections/Itineraries'
import { getDict, localePath } from '@/lib/i18n'
import { pageLang } from '@/lib/pageLang'
import { getPayloadClient } from '@/lib/payload'
import { pageMeta } from '@/lib/seo'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ lang: string }>; searchParams: Promise<{ style?: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await pageLang(params)
  const t = getDict(lang).safaris
  return pageMeta({ lang, path: '/safaris', title: t.title, description: t.description })
}

export default async function SafarisPage({ params, searchParams }: Props) {
  const lang = await pageLang(params)
  const t = getDict(lang)
  const { style = '' } = await searchParams
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'itineraries',
    where: { _status: { equals: 'published' }, ...(style ? { styles: { contains: style } } : {}) },
    sort: 'durationDays',
    limit: 100,
    locale: lang,
  })
  return (
    <>
      <section className="container page-intro">
        <span className="eyebrow">{t.nav.safaris}</span>
        <h1>{t.safaris.heading}</h1>
        <p className="lead">{t.safaris.lead}</p>
      </section>
      <section className="container" style={{ paddingBottom: 100 }}>
        <nav className="filters" aria-label={t.safaris.filter}>
          <Link href={localePath(lang, '/safaris')} className={!style ? 'active' : ''}>{t.all}</Link>
          {TRIP_STYLES.map((s) => (
            <Link key={s.value} href={`?style=${s.value}`} className={style === s.value ? 'active' : ''}>
              {t.styles[s.value] ?? s.label}
            </Link>
          ))}
        </nav>
        <div className="grid grid-3">
          {docs.map((s) => <SafariCard key={s.id} s={s} lang={lang} />)}
        </div>
        {!docs.length && (
          <p className="muted">
            {t.safaris.none} <Link href={localePath(lang, '/plan')}>{t.safaris.buildOwn}</Link>.
          </p>
        )}
      </section>
    </>
  )
}
