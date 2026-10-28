import type { MetadataRoute } from 'next'

import { getPayloadClient } from '@/lib/payload'
import { siteUrl } from '@/lib/seo'

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
  const pages: MetadataRoute.Sitemap = ['', '/about', '/plan', '/expert', '/contact'].map((p) => ({
    url: base + p,
    priority: p ? 0.6 : 1,
  }))
  for (const { collection, path } of SECTIONS) {
    pages.push({ url: base + path, priority: 0.8 })
    const { docs } = await payload.find({
      collection,
      where: { _status: { equals: 'published' } },
      select: { slug: true, updatedAt: true },
      limit: 1000,
      depth: 0,
    })
    for (const doc of docs) {
      pages.push({ url: `${base}${path}/${doc.slug}`, lastModified: doc.updatedAt, priority: 0.7 })
    }
  }
  return pages
}
