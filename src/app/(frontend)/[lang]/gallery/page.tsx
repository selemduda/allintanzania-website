import type { Metadata } from 'next'
import React from 'react'

import { GalleryGrid, type GalleryPhoto } from '@/components/GalleryGrid'
import { mediaPath } from '@/lib/format'
import { getDict } from '@/lib/i18n'
import { pageLang } from '@/lib/pageLang'
import { getPayloadClient } from '@/lib/payload'
import { pageMeta } from '@/lib/seo'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ lang: string }> }

/** The gallery shows everything in the "Gallery" folder of the Media library. */
const GALLERY_FOLDER = 'Gallery'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await pageLang(params)
  const t = getDict(lang).gallery
  return pageMeta({ lang, path: '/gallery', title: t.title, description: t.description })
}

export default async function GalleryPage({ params }: Props) {
  const lang = await pageLang(params)
  const t = getDict(lang)
  const payload = await getPayloadClient()
  const folders = await payload.find({
    collection: 'payload-folders',
    where: { name: { like: GALLERY_FOLDER } },
    limit: 1,
    depth: 0,
  })
  const folder = folders.docs[0]
  const media = folder
    ? (
        await payload.find({
          collection: 'media',
          where: { folder: { equals: folder.id } },
          sort: '-createdAt',
          limit: 300,
          depth: 0,
        })
      ).docs
    : []

  const photos: GalleryPhoto[] = media
    .filter((m) => m.mimeType?.startsWith('image/') && m.url)
    .map((m) => ({
      id: m.id,
      src: mediaPath(m.sizes?.hero?.url ?? m.url)!,
      width: (m.sizes?.hero?.url ? m.sizes.hero.width : m.width) ?? 1600,
      height: (m.sizes?.hero?.url ? m.sizes.hero.height : m.height) ?? 1066,
      alt: m.alt ?? '',
      caption: m.caption ?? undefined,
    }))
  const videos = media.filter((m) => m.mimeType?.startsWith('video/') && m.url)

  return (
    <>
      <section className="container page-intro">
        <span className="eyebrow">{t.nav.gallery}</span>
        <h1>{t.gallery.heading}</h1>
        <p className="lead">{t.gallery.lead}</p>
      </section>
      <section className="container" style={{ paddingBottom: 100 }}>
        {videos.length > 0 && (
          <>
            <h2 className="gallery-heading">{t.gallery.videos}</h2>
            <div className="gallery-videos">
              {videos.map((v) => (
                <figure key={v.id}>
                  <video src={mediaPath(v.url)!} controls preload="metadata" playsInline />
                  {(v.caption || v.alt) && <figcaption>{v.caption || v.alt}</figcaption>}
                </figure>
              ))}
            </div>
          </>
        )}
        {photos.length > 0 && (
          <>
            {videos.length > 0 && <h2 className="gallery-heading">{t.gallery.photos}</h2>}
            <GalleryGrid photos={photos} labels={t.gallery} />
          </>
        )}
        {!media.length && <p className="muted">{t.gallery.empty}</p>}
      </section>
    </>
  )
}
