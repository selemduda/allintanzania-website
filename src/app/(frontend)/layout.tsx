import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import React from 'react'

import { ExpertLauncher } from '@/components/ExpertLauncher'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { getPublicExpert, getSiteSettings } from '@/lib/payload'
import { indexable, jsonLd, siteUrl } from '@/lib/seo'
import './styles.css'

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
})
const sans = Inter({ subsets: ['latin'], variable: '--font-sans' })

// A function, so the indexing switch is read when the site runs rather than when it is built.
export const generateMetadata = (): Metadata => ({
  metadataBase: new URL(siteUrl()),
  title: {
    default: 'All in Tanzania · Tailor-made Tanzania safaris',
    template: '%s · All in Tanzania',
  },
  description:
    'Tailor-made safaris in the Serengeti, Ngorongoro, Tarangire, Ruaha, Kilimanjaro and Zanzibar, planned by Tanzanian safari experts.',
  icons: { icon: '/favicon.png' },
  openGraph: { type: 'website', siteName: 'All in Tanzania' },
  // The test site must never compete with the live one in search results.
  ...(indexable() ? {} : { robots: { index: false, follow: false } }),
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [expert, site] = await Promise.all([getPublicExpert(), getSiteSettings()])
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
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(organization)} />
        <Header />
        <main>{children}</main>
        <Footer />
        {expert.enabled && <ExpertLauncher expert={expert} />}
      </body>
    </html>
  )
}
