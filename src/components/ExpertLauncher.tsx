'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import type { PublicExpert } from '@/lib/payload'

export function ExpertLauncher({ expert }: { expert: PublicExpert }) {
  if (usePathname() === '/expert' || !expert.enabled) return null
  return (
    <Link href="/expert" className="expert-launcher" aria-label={`Talk to ${expert.name}, our safari expert`}>
      <span className="expert-launcher-dot" aria-hidden />
      <span>
        <strong>Talk to {expert.name}</strong>
        <small>Your safari expert</small>
      </span>
    </Link>
  )
}
