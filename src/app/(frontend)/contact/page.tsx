import type { Metadata } from 'next'
import React from 'react'

import { EnquiryForm } from '@/components/EnquiryForm'
import { getSiteSettings } from '@/lib/payload'
import { pageMeta } from '@/lib/seo'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = pageMeta({
  path: '/contact',
  title: 'Contact us',
  description: 'Talk to our safari experts in Norway and Tanzania about your tailor-made Tanzania safari.',
})

export default async function ContactPage() {
  const site = await getSiteSettings()
  return (
    <section className="container page-intro" style={{ paddingBottom: 110 }}>
      <div className="detail-grid">
        <div>
          <span className="eyebrow">Contact</span>
          <h1>Let’s plan your safari</h1>
          <p className="lead">Tell us a little about your trip and a safari expert from our Arusha team will reply personally.</p>
          <div style={{ marginTop: 32 }}>
            <EnquiryForm source="contact" />
          </div>
        </div>
        <aside className="detail-aside">
          <dl>
            {site.email && (<><dt>Email</dt><dd><a href={`mailto:${site.email}`}>{site.email}</a></dd></>)}
            {site.phone && (<><dt>Phone</dt><dd><a href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a></dd></>)}
            {site.whatsapp && (
              <>
                <dt>WhatsApp</dt>
                <dd><a href={`https://wa.me/${site.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">{site.whatsapp}</a></dd>
              </>
            )}
            {site.address && (<><dt>Office</dt><dd style={{ whiteSpace: 'pre-line' }}>{site.address}</dd></>)}
          </dl>
        </aside>
      </div>
    </section>
  )
}
