import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { Img } from '@/components/Img'
import { getDict, localePath, type Lang } from '@/lib/i18n'
import { pageLang } from '@/lib/pageLang'
import { getPayloadClient } from '@/lib/payload'
import { pageMeta } from '@/lib/seo'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ lang: string }> }

const paragraphs = (text?: string | null) =>
  (text ?? '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

async function getAbout(lang: Lang) {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'about-page', locale: lang, depth: 1 })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await pageLang(params)
  const t = getDict(lang).about
  const about = await getAbout(lang)
  return pageMeta({
    lang,
    path: '/about',
    title: about.metaTitle || t.title,
    description: about.metaDescription || t.description,
  })
}

export default async function AboutPage({ params }: Props) {
  const lang = await pageLang(params)
  const t = getDict(lang)
  const about = await getAbout(lang)
  const intro = paragraphs(about.intro || t.about.lead)
  const sections = (about.sections ?? []).filter((s) => s.heading || s.body)
  const values = about.values ?? []
  return (
    <>
      <section className="container page-intro" style={{ textAlign: 'center' }}>
        {about.showLogo !== false && (
          <Image src="/brand/logo.png" alt="All in Tanzania" width={420} height={167} style={{ margin: '0 auto 32px', height: 'auto' }} />
        )}
        <h1>{about.heading || t.about.heading}</h1>
        {intro.map((p, i) => (
          <p key={i} className="lead" style={{ margin: '0 auto 16px' }}>
            {p}
          </p>
        ))}
      </section>
      {about.image && typeof about.image === 'object' && (
        <section className="container" style={{ paddingBottom: 'clamp(48px, 8vw, 96px)' }}>
          <div className="split-media" style={{ aspectRatio: '16 / 9' }}>
            <Img media={about.image} priority sizes="(max-width: 1200px) 100vw, 1200px" />
          </div>
        </section>
      )}
      {sections.map((s, i) => {
        const hasImage = Boolean(s.image && typeof s.image === 'object')
        const text = (
          <div>
            {s.heading && <h2>{s.heading}</h2>}
            {paragraphs(s.body).map((p, j) => (
              <p key={j}>{p}</p>
            ))}
          </div>
        )
        return (
          <section key={s.id ?? i} className={`section${i % 2 === 1 ? ' section-sand' : ''}`}>
            {hasImage ? (
              <div className="container split">
                {i % 2 === 1 && (
                  <div className="split-media">
                    <Img media={s.image} size="card" sizes="(max-width: 860px) 100vw, 50vw" />
                  </div>
                )}
                {text}
                {i % 2 === 0 && (
                  <div className="split-media">
                    <Img media={s.image} size="card" sizes="(max-width: 860px) 100vw, 50vw" />
                  </div>
                )}
              </div>
            ) : (
              <div className="container" style={{ maxWidth: 760 }}>
                {text}
              </div>
            )}
          </section>
        )
      })}
      {values.length > 0 && (
        <section className="section section-dark">
          <div className="container pillars">
            {values.map((p) => (
              <div key={p.id}>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2>{about.closingHeading || t.about.ready}</h2>
          <div className="hero-actions" style={{ justifyContent: 'center' }}>
            <Link href={localePath(lang, '/plan')} className="btn btn-primary">{t.buildDream}</Link>
            <Link href={localePath(lang, '/contact')} className="btn btn-ghost">{t.footer.contactUs}</Link>
          </div>
        </div>
      </section>
    </>
  )
}
