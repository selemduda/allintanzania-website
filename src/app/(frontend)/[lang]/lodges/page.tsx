import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { LodgeCard } from '@/components/Cards'
import { TIERS } from '@/collections/Lodges'
import { getDict, localePath } from '@/lib/i18n'
import { pageLang } from '@/lib/pageLang'
import { getPayloadClient } from '@/lib/payload'
import { pageMeta } from '@/lib/seo'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ lang: string }>; searchParams: Promise<{ tier?: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await pageLang(params)
  const t = getDict(lang).lodges
  return pageMeta({ lang, path: '/lodges', title: t.title, description: t.description })
}

export default async function LodgesPage({ params, searchParams }: Props) {
  const lang = await pageLang(params)
  const t = getDict(lang)
  const { tier = '' } = await searchParams
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'lodges',
    where: { _status: { equals: 'published' }, ...(tier ? { tier: { equals: tier } } : {}) },
    sort: 'name',
    limit: 200,
    depth: 1,
    locale: lang,
  })
  return (
    <>
      <section className="container page-intro">
        <span className="eyebrow">{t.nav.lodges}</span>
        <h1>{t.lodges.heading}</h1>
        <p className="lead">{t.lodges.lead}</p>
      </section>
      <section className="container" style={{ paddingBottom: 100 }}>
        <nav className="filters" aria-label={t.lodges.filter}>
          <Link href={localePath(lang, '/lodges')} className={!tier ? 'active' : ''}>{t.all}</Link>
          {TIERS.map((tr) => (
            <Link key={tr.value} href={`?tier=${tr.value}`} className={tier === tr.value ? 'active' : ''}>
              {t.tierFilters[tr.value]}
            </Link>
          ))}
        </nav>
        <div className="grid grid-3">
          {docs.map((l) => <LodgeCard key={l.id} l={l} lang={lang} />)}
        </div>
        {!docs.length && <p className="muted">{t.lodges.none}</p>}
      </section>
    </>
  )
}
