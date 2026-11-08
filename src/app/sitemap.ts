import type { MetadataRoute } from 'next'

import { LANGS, localePath } from '@/lib/i18n'
import { getPayloadClient } from '@/lib/payload'
import { languageAlternates, siteUrl } from '@/lib/seo'

export const dynamic = 'force-dynamic'

const SECTIONS = [
  { collection: 'destinations', path: '/destinations' },
  { collection: 'itineraries', path: '/safaris' },
  { collection: 'lodges', path: '/lodges' },
  { collection: 'posts', path: '/journal' },
] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl()
  const payload = await getPayloadClient()
  const pages: { path: string; priority: number; lastModified?: string }[] = [
    { path: '/', priority: 1 },
    ...['/about', '/gallery', '/plan', '/expert', '/contact'].map((path) => ({ path, priority: 0.6 })),
  ]
  for (const { collection, path } of SECTIONS) {
    pages.push({ path, priority: 0.8 })
    const { docs } = await payload.find({
      collection,
      where: { _status: { equals: 'published' } },
      select: { slug: true, updatedAt: true },
      limit: 1000,
      depth: 0,
    })
    for (const doc of docs) pages.push({ path: `${path}/${doc.slug}`, priority: 0.7, lastModified: doc.updatedAt })
  }
  // Every page in every language, each listing its other language versions for search engines.
  return pages.flatMap(({ path, priority, lastModified }) => {
    const languages = Object.fromEntries(
      Object.entries(languageAlternates(path)).map(([lang, href]) => [lang, base + href]),
    )
    return LANGS.map((lang) => ({
      url: base + localePath(lang, path),
      priority,
      lastModified,
      alternates: { languages },
    }))
  })
}
