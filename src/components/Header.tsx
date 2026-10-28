'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const NAV = [
  { href: '/destinations', label: 'Destinations' },
  { href: '/safaris', label: 'Safaris' },
  { href: '/lodges', label: 'Lodges & Camps' },
  { href: '/journal', label: 'Journal' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

const HERO_PAGES = /^\/(about|(destinations|safaris|lodges|journal)\/[^/]+)?$/

export function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) {
    // Close the mobile menu after navigating.
    setLastPath(pathname)
    setOpen(false)
  }
  // Only pages that open with a full-bleed photo get the see-through header.
  const overHero = HERO_PAGES.test(pathname ?? '')

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
        <Link href="/" className="brand" aria-label="All in Tanzania home">
          <Image
            src={solid ? '/brand/logo.png' : '/brand/logo-white.png'}
            alt="All in Tanzania"
            width={150}
            height={60}
            priority
          />
        </Link>
        <nav className="main-nav" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname?.startsWith(item.href) ? 'active' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link href="/plan" className="btn btn-primary btn-sm">
            Plan my safari
          </Link>
          <button
            className="menu-toggle"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
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
