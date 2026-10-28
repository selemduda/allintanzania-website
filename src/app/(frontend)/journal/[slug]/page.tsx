import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import { Img } from '@/components/Img'
import { RichText } from '@/components/RichText'
import { findBySlug } from '@/lib/payload'
import { pageMeta } from '@/lib/seo'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await findBySlug('posts', (await params).slug)
  return p ? pageMeta({ path: `/journal/${p.slug}`, title: p.title, description: p.excerpt, image: p.heroImage }) : {}
}

export default async function PostPage({ params }: Props) {
  const p = await findBySlug('posts', (await params).slug)
  if (!p) notFound()
  return (
    <>
      <section className="hero hero-short">
        <div className="hero-media">
          <Img media={p.heroImage} size="hero" priority />
        </div>
        <div className="container hero-content">
          <span className="eyebrow">Journal{p.author ? ` · ${p.author}` : ''}</span>
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
