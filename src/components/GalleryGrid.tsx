'use client'

import Image from 'next/image'
import React, { useCallback, useEffect, useRef, useState } from 'react'

export type GalleryPhoto = {
  id: number
  src: string
  width: number
  height: number
  alt: string
  caption?: string
}

type Labels = { open: string; close: string; previous: string; next: string }

/** Masonry grid of photos; a click opens the photo full screen, with arrow keys to browse. */
export function GalleryGrid({ photos, labels }: { photos: GalleryPhoto[]; labels: Labels }) {
  const [index, setIndex] = useState<number | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)

  const step = useCallback(
    (by: number) => setIndex((i) => (i === null ? i : (i + by + photos.length) % photos.length)),
    [photos.length],
  )

  useEffect(() => {
    const d = dialog.current
    if (!d) return
    if (index !== null && !d.open) d.showModal()
    if (index === null && d.open) d.close()
  }, [index])

  useEffect(() => {
    if (index === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, step])

  const current = index === null ? null : photos[index]
  return (
    <>
      <div className="gallery-grid">
        {photos.map((p, i) => (
          <button key={p.id} type="button" className="gallery-item" onClick={() => setIndex(i)} aria-label={`${labels.open}: ${p.alt}`}>
            <Image src={p.src} alt={p.alt} width={p.width} height={p.height} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
          </button>
        ))}
      </div>
      <dialog ref={dialog} className="lightbox" onClose={() => setIndex(null)} onClick={(e) => e.target === e.currentTarget && setIndex(null)}>
        {current && (
          <figure>
            <Image src={current.src} alt={current.alt} width={current.width} height={current.height} sizes="100vw" />
            {(current.caption || current.alt) && <figcaption>{current.caption || current.alt}</figcaption>}
          </figure>
        )}
        <button type="button" className="lightbox-close" onClick={() => setIndex(null)} aria-label={labels.close}>×</button>
        {photos.length > 1 && (
          <>
            <button type="button" className="lightbox-prev" onClick={() => step(-1)} aria-label={labels.previous}>‹</button>
            <button type="button" className="lightbox-next" onClick={() => step(1)} aria-label={labels.next}>›</button>
          </>
        )}
      </dialog>
    </>
  )
}
