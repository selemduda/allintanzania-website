import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import React from 'react'

import { ExpertLauncher } from '@/components/ExpertLauncher'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { getPublicExpert, getSiteSettings } from '@/lib/payload'
import { getDict, HTML_LANG } from '@/lib/i18n'
import { pageLang } from '@/lib/pageLang'
import { indexable, jsonLd, siteUrl } from '@/lib/seo'
import '../styles.css'

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
})
const sans = Inter({ subsets: ['latin'], variable: '--font-sans' })

// A function, so the indexing switch is read when the site runs rather than when it is built.
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const t = getDict(await pageLang(params))
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: t.home.title, template: '%s · All in Tanzania' },
    description: t.home.description,
    icons: { icon: '/favicon.png' },
    openGraph: { type: 'website', siteName: 'All in Tanzania' },
    // The test site must never compete with the live one in search results.
    ...(indexable() ? {} : { robots: { index: false, follow: false } }),
  }
}

type Props = { children: React.ReactNode; params: Promise<{ lang: string }> }

export default async function RootLayout({ children, params }: Props) {
  const lang = await pageLang(params)
  const [expert, site] = await Promise.all([getPublicExpert(lang), getSiteSettings(lang)])
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: site.companyName || 'All in Tanzania',
    url: siteUrl(),
    logo: `${siteUrl()}/favicon.png`,
    email: site.email || undefined,
    telephone: site.phone || undefined,
    address: site.address || undefined,
    areaServed: ['Norway', 'Sweden', 'Denmark', 'Tanzania'],
    sameAs: (site.social ?? []).map((s) => s.url),
  }
  return (
    <html lang={HTML_LANG[lang]} className={`${serif.variable} ${sans.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(organization)} />
        <Header lang={lang} />
        <main>{children}</main>
        <Footer lang={lang} />
        {expert.enabled && <ExpertLauncher expert={expert} lang={lang} />}
      </body>
    </html>
  )
}
