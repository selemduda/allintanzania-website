import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import { Img } from '@/components/Img'
import { RichText } from '@/components/RichText'
import { getDict } from '@/lib/i18n'
import { pageLang } from '@/lib/pageLang'
import { findBySlug } from '@/lib/payload'
import { pageMeta } from '@/lib/seo'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ lang: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await pageLang(params)
  const p = await findBySlug('posts', (await params).slug, lang)
  return p ? pageMeta({ lang, path: `/journal/${p.slug}`, title: p.title, description: p.excerpt, image: p.heroImage }) : {}
}

export default async function PostPage({ params }: Props) {
  const lang = await pageLang(params)
  const p = await findBySlug('posts', (await params).slug, lang)
  if (!p) notFound()
  return (
    <>
      <section className="hero hero-short">
        <div className="hero-media">
          <Img media={p.heroImage} size="hero" priority />
        </div>
        <div className="container hero-content">
          <span className="eyebrow">{getDict(lang).nav.journal}{p.author ? ` · ${p.author}` : ''}</span>
          <h1>{p.title}</h1>
        </div>
      </section>
      <section className="section">
        <div className="container">
          {p.excerpt && <p className="lead">{p.excerpt}</p>}
          <RichText data={p.body} />
        </div>
      </section>
    </>
  )
}
