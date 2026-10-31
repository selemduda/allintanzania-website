import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { Img } from '@/components/Img'
import { DATE_LOCALE, getDict, localePath } from '@/lib/i18n'
import { pageLang } from '@/lib/pageLang'
import { getPayloadClient } from '@/lib/payload'
import { pageMeta } from '@/lib/seo'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await pageLang(params)
  const t = getDict(lang).journal
  return pageMeta({ lang, path: '/journal', title: t.title, description: t.description })
}

export default async function JournalPage({ params }: Props) {
  const lang = await pageLang(params)
  const t = getDict(lang)
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 50,
    locale: lang,
  })
  return (
    <>
      <section className="container page-intro">
        <span className="eyebrow">{t.nav.journal}</span>
        <h1>{t.journal.heading}</h1>
        <p className="lead">{t.journal.lead}</p>
      </section>
      <section className="container" style={{ paddingBottom: 100 }}>
        <div className="grid grid-3">
          {docs.map((p) => (
            <Link key={p.id} href={localePath(lang, `/journal/${p.slug}`)} className="card">
              <div className="card-media">
                <Img media={p.heroImage} size="card" sizes="33vw" />
              </div>
              <div className="card-body">
                {p.publishedAt && (
                  <span className="muted" style={{ fontSize: '0.85rem' }}>
                    {new Date(p.publishedAt).toLocaleDateString(DATE_LOCALE[lang], { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                )}
                <h3>{p.title}</h3>
                {p.excerpt && <p>{p.excerpt}</p>}
              </div>
            </Link>
          ))}
        </div>
        {!docs.length && <p className="muted">{t.journal.empty}</p>}
      </section>
    </>
  )
}
