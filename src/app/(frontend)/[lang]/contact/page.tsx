import type { Metadata } from 'next'
import React from 'react'

import { EnquiryForm } from '@/components/EnquiryForm'
import { getDict } from '@/lib/i18n'
import { pageLang } from '@/lib/pageLang'
import { getSiteSettings } from '@/lib/payload'
import { pageMeta } from '@/lib/seo'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await pageLang(params)
  const t = getDict(lang).contact
  return pageMeta({ lang, path: '/contact', title: t.title, description: t.description })
}

export default async function ContactPage({ params }: Props) {
  const lang = await pageLang(params)
  const t = getDict(lang).contact
  const site = await getSiteSettings(lang)
  return (
    <section className="container page-intro" style={{ paddingBottom: 110 }}>
      <div className="detail-grid">
        <div>
          <span className="eyebrow">{t.eyebrow}</span>
          <h1>{t.heading}</h1>
          <p className="lead">{t.lead}</p>
          <div style={{ marginTop: 32 }}>
            <EnquiryForm source="contact" lang={lang} />
          </div>
        </div>
        <aside className="detail-aside">
          <dl>
            {site.email && (<><dt>{t.email}</dt><dd><a href={`mailto:${site.email}`}>{site.email}</a></dd></>)}
            {site.phone && (<><dt>{t.phone}</dt><dd><a href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a></dd></>)}
            {site.whatsapp && (
              <>
                <dt>WhatsApp</dt>
                <dd><a href={`https://wa.me/${site.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">{site.whatsapp}</a></dd>
              </>
            )}
            {site.address && (<><dt>{t.office}</dt><dd style={{ whiteSpace: 'pre-line' }}>{site.address}</dd></>)}
          </dl>
        </aside>
      </div>
    </section>
  )
}
