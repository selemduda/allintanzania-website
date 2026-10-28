import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { ExpertChat } from '@/components/ExpertChat'
import { getDict, localePath } from '@/lib/i18n'
import { pageLang } from '@/lib/pageLang'
import { getPublicExpert } from '@/lib/payload'
import { pageMeta } from '@/lib/seo'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ lang: string }>; searchParams: Promise<{ about?: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await pageLang(params)
  const t = getDict(lang).expert
  const expert = await getPublicExpert(lang)
  return pageMeta({ lang, path: '/expert', title: t.title(expert.name), description: t.description })
}

export default async function ExpertPage({ params, searchParams }: Props) {
  const lang = await pageLang(params)
  const t = getDict(lang).expert
  const expert = await getPublicExpert(lang)
  const { about } = await searchParams
  const initialQuestion = about ? t.tellMeMore(about.slice(0, 120)) : undefined

  return (
    <section className="container expert-page">
      <div className="expert-intro">
        <span className="eyebrow">{t.eyebrow}</span>
        <h1>{t.heading(expert.name)}</h1>
        <p className="lead">{t.lead}</p>
        <p className="muted">
          {t.handover(expert.name)}
          <Link href={localePath(lang, '/plan')}>{t.tripBuilder}</Link>.
        </p>
      </div>
      <ExpertChat expert={expert} initialQuestion={initialQuestion} lang={lang} />
    </section>
  )
}
