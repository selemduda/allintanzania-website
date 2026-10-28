'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { getDict, localePath, stripLang, type Lang } from '@/lib/i18n'

const NAV = ['destinations', 'safaris', 'lodges', 'journal', 'about', 'contact'] as const

const HERO_PAGES = /^\/(about|(destinations|safaris|lodges|journal)\/[^/]+)?$/

export function Header({ lang }: { lang: Lang }) {
  const t = getDict(lang)
  const fullPath = usePathname() ?? '/'
  // The page's address without the language prefix, e.g. '/safaris' for both /safaris and /no/safaris.
  const pathname = stripLang(fullPath)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) {
    // Close the mobile menu after navigating.
    setLastPath(pathname)
    setOpen(false)
  }
  // Only pages that open with a full-bleed photo get the see-through header.
  const overHero = HERO_PAGES.test(pathname)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const solid = scrolled || open || !overHero
  return (
    <header className={`site-header ${solid ? 'is-solid' : ''} ${open ? 'is-open' : ''}`}>
      <div className="container header-inner">
        <Link href={localePath(lang, '/')} className="brand" aria-label={t.nav.home}>
          <Image
            src={solid ? '/brand/logo.png' : '/brand/logo-white.png'}
            alt="All in Tanzania"
            width={150}
            height={60}
            priority
          />
        </Link>
        <nav className="main-nav" aria-label="Main">
          {NAV.map((key) => (
            <Link
              key={key}
              href={localePath(lang, `/${key}`)}
              className={pathname.startsWith(`/${key}`) ? 'active' : undefined}
            >
              {t.nav[key]}
            </Link>
          ))}
          <Link
            href={localePath(lang === 'en' ? 'no' : 'en', pathname)}
            hrefLang={lang === 'en' ? 'nb' : 'en'}
            className="lang-switch"
            aria-label={`${t.nav.language}: ${t.nav.otherLanguage}`}
          >
            {lang === 'en' ? 'NO' : 'EN'}
          </Link>
        </nav>
        <div className="header-actions">
          <Link href={localePath(lang, '/plan')} className="btn btn-primary btn-sm">
            {t.nav.plan}
          </Link>
          <button
            className="menu-toggle"
            aria-expanded={open}
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  )
}
