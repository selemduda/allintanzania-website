'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import { getDict, localePath, stripLang, type Lang } from '@/lib/i18n'
import type { PublicExpert } from '@/lib/payload'

export function ExpertLauncher({ expert, lang }: { expert: PublicExpert; lang: Lang }) {
  const pathname = usePathname()
  if (stripLang(pathname ?? '/') === '/expert' || !expert.enabled) return null
  const t = getDict(lang).expert
  return (
    <Link href={localePath(lang, '/expert')} className="expert-launcher" aria-label={t.title(expert.name)}>
      <span className="expert-launcher-dot" aria-hidden />
      <span>
        <strong>{t.launcher(expert.name)}</strong>
        <small>{t.launcherSub}</small>
      </span>
    </Link>
  )
}
