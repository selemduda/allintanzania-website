import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { getDict, localePath } from '@/lib/i18n'
import { pageLang } from '@/lib/pageLang'
import { getPayloadClient } from '@/lib/payload'
import { pageMeta } from '@/lib/seo'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await pageLang(params)
  const t = getDict(lang).about
  return pageMeta({ lang, path: '/about', title: t.title, description: t.description })
}

export default async function AboutPage({ params }: Props) {
  const lang = await pageLang(params)
  const t = getDict(lang)
  const payload = await getPayloadClient()
  const home = await payload.findGlobal({ slug: 'home-page', locale: lang })
  return (
    <>
      <section className="container page-intro" style={{ textAlign: 'center' }}>
        <Image src="/brand/logo.png" alt="All in Tanzania" width={420} height={167} style={{ margin: '0 auto 32px', height: 'auto' }} />
        <h1>{t.about.heading}</h1>
        <p className="lead" style={{ margin: '0 auto' }}>
          {t.about.lead}
        </p>
      </section>
      {home.pillars && home.pillars.length > 0 && (
        <section className="section section-dark">
          <div className="container pillars">
            {home.pillars.map((p) => (
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
          <h2>{t.about.ready}</h2>
          <div className="hero-actions" style={{ justifyContent: 'center' }}>
            <Link href={localePath(lang, '/plan')} className="btn btn-primary">{t.buildDream}</Link>
            <Link href={localePath(lang, '/contact')} className="btn btn-ghost">{t.footer.contactUs}</Link>
          </div>
        </div>
      </section>
    </>
  )
}
