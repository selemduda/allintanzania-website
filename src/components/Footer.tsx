import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { getDict, localePath, type Lang } from '@/lib/i18n'
import { getSiteSettings } from '@/lib/payload'

export async function Footer({ lang }: { lang: Lang }) {
  const site = await getSiteSettings(lang)
  const t = getDict(lang)
  const href = (path: string) => localePath(lang, path)
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Image src="/brand/logo-white.png" alt="All in Tanzania" width={200} height={80} />
          <p className="footer-note">
            {site.footerNote || t.footer.note}
          </p>
        </div>
        <div>
          <h4>{t.footer.explore}</h4>
          <ul>
            <li><Link href={href('/destinations')}>{t.nav.destinations}</Link></li>
            <li><Link href={href('/safaris')}>{t.nav.safaris}</Link></li>
            <li><Link href={href('/lodges')}>{t.nav.lodges}</Link></li>
            <li><Link href={href('/journal')}>{t.nav.journal}</Link></li>
          </ul>
        </div>
        <div>
          <h4>{t.footer.plan}</h4>
          <ul>
            <li><Link href={href('/plan')}>{t.footer.buildTrip}</Link></li>
            <li><Link href={href('/expert')}>{t.footer.talkExpert}</Link></li>
            <li><Link href={href('/contact')}>{t.footer.contactUs}</Link></li>
            <li><Link href={href('/about')}>{t.footer.aboutUs}</Link></li>
          </ul>
        </div>
        <div>
          <h4>{t.footer.getInTouch}</h4>
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
