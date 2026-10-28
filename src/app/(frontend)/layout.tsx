import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import React from 'react'

import { ExpertLauncher } from '@/components/ExpertLauncher'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { getPublicExpert } from '@/lib/payload'
import './styles.css'

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
})
const sans = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
  title: {
    default: 'All in Tanzania · Tailor-made Tanzania safaris',
    template: '%s · All in Tanzania',
  },
  description:
    'Tailor-made safaris in the Serengeti, Ngorongoro, Tarangire, Ruaha, Kilimanjaro and Zanzibar, planned by Tanzanian safari experts.',
  icons: { icon: '/favicon.png' },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const expert = await getPublicExpert()
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        {expert.enabled && <ExpertLauncher expert={expert} />}
      </body>
    </html>
  )
}
