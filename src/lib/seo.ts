import type { Metadata } from 'next'

import type { Media } from '@/payload-types'

import { mediaPath, rel } from './format'
import { HTML_LANG, LANGS, localePath, type Lang } from './i18n'

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

/** Every language version of a page, for hreflang links and the sitemap. */
export const languageAlternates = (path: string) => ({
  ...Object.fromEntries(LANGS.map((l) => [HTML_LANG[l], localePath(l, path)])),
  'x-default': path,
})

/** Title, description, canonical URL, language versions and social preview for one page. */
export function pageMeta({
  lang,
  path,
  title,
  description,
  image,
}: {
  lang: Lang
  /** The page's path without a language prefix, e.g. '/safaris'. */
  path: string
  title?: string
  description?: string | null
  image?: Media | number | null
}): Metadata {
  const img = shareImage(image)
  const url = localePath(lang, path)
  return {
    ...(title ? { title } : {}),
    description: description ?? undefined,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      title,
      description: description ?? undefined,
      url,
      locale: lang === 'no' ? 'nb_NO' : 'en_GB',
      ...(img ? { images: [{ url: img }] } : {}),
    },
  }
}

/** Renders a schema.org object for search engines. */
export const jsonLd = (data: object) => ({ __html: JSON.stringify(data).replace(/</g, '\\u003c') })
