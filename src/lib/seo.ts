import type { Metadata } from 'next'

import type { Media } from '@/payload-types'

import { mediaPath, rel } from './format'

// Read at run time: NEXT_PUBLIC_ variables are frozen into the build, which happens without .env.
export const siteUrl = () => {
  const domain = process.env.SITE_DOMAIN
  return (process.env.SITE_URL || (domain ? `https://${domain}` : 'http://localhost:3000')).replace(/\/$/, '')
}

/** Only the live site may be indexed; test copies stay out of search results. */
export const indexable = () => process.env.SITE_INDEXABLE === 'true'

/** Absolute URL for a share image, preferring the card-sized crop. */
export function shareImage(media: Media | number | null | undefined) {
  const m = rel(media)
  const url = mediaPath(m?.sizes?.card?.url || m?.url)
  if (!url) return undefined
  return url.startsWith('http') ? url : siteUrl() + url
}

/** Title, description, canonical URL and social preview for one page. */
export function pageMeta({
  path,
  title,
  description,
  image,
}: {
  path: string
  title?: string
  description?: string | null
  image?: Media | number | null
}): Metadata {
  const img = shareImage(image)
  return {
    title,
    description: description ?? undefined,
    alternates: { canonical: path },
    openGraph: {
      title,
      description: description ?? undefined,
      url: path,
      ...(img ? { images: [{ url: img }] } : {}),
    },
  }
}

/** Renders a schema.org object for search engines. */
export const jsonLd = (data: object) => ({ __html: JSON.stringify(data).replace(/</g, '\\u003c') })
