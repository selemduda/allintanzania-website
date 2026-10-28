import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { getSiteSettings } from '@/lib/payload'

export async function Footer() {
  const site = await getSiteSettings()
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Image src="/brand/logo-white.png" alt="All in Tanzania" width={200} height={80} />
          <p className="footer-note">
            {site.footerNote ||
              'Tailor-made safaris across Tanzania, planned by guides who grew up here.'}
          </p>
        </div>
        <div>
          <h4>Explore</h4>
          <ul>
            <li><Link href="/destinations">Destinations</Link></li>
            <li><Link href="/safaris">Safaris</Link></li>
            <li><Link href="/lodges">Lodges & Camps</Link></li>
            <li><Link href="/journal">Journal</Link></li>
          </ul>
        </div>
        <div>
          <h4>Plan</h4>
          <ul>
            <li><Link href="/plan">Build your dream trip</Link></li>
            <li><Link href="/expert">Talk to a safari expert</Link></li>
            <li><Link href="/contact">Contact us</Link></li>
            <li><Link href="/about">About us</Link></li>
          </ul>
        </div>
        <div>
          <h4>Get in touch</h4>
          <ul>
            {site.email && <li><a href={`mailto:${site.email}`}>{site.email}</a></li>}
            {site.phone && <li><a href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a></li>}
            {site.whatsapp && (
              <li>
                <a href={`https://wa.me/${site.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </li>
            )}
            {site.address && <li className="muted">{site.address}</li>}
          </ul>
          {site.social && site.social.length > 0 && (
            <div className="social">
              {site.social.map((s) => (
                <a key={s.id ?? s.url} href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.platform}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {year} {site.companyName || 'All in Tanzania'}</span>
        <span className="tagline">{site.tagline}</span>
      </div>
    </footer>
  )
}
