import Image from 'next/image'
import React from 'react'

import { mediaPath } from '@/lib/format'
import type { Media } from '@/payload-types'

type Props = {
  media?: Media | number | null
  size?: 'thumbnail' | 'card' | 'hero'
  fill?: boolean
  priority?: boolean
  sizes?: string
  className?: string
  alt?: string
}

/** Renders a CMS photo, or a soft savanna gradient when none has been chosen yet. */
export function Img({ media, size, fill = true, priority, sizes = '100vw', className, alt }: Props) {
  if (!media || typeof media !== 'object' || !media.url) {
    return <div className={`img-fallback ${className ?? ''}`} aria-hidden />
  }
  // Boxes crop with object-fit, so they need the whole photo: the fixed-size "card" and
  // "thumbnail" variants are already centre-cropped and would be cropped a second time.
  // The uncropped "hero" variant is used instead; next/image resizes it to `sizes`.
  const variant = fill ? media.sizes?.hero : size ? media.sizes?.[size] : undefined
  const src = mediaPath(variant?.url || media.url)!
  // Payload stores 50/50 when no focal point was set. Most safari photos have people and
  // animal heads above the middle, so lean the default crop upwards.
  const hasFocal =
    media.focalX != null && media.focalY != null && !(media.focalX === 50 && media.focalY === 50)
  const focal = hasFocal ? `${media.focalX}% ${media.focalY}%` : '50% 30%'
  return (
    <Image
      src={src}
      alt={alt ?? media.alt ?? ''}
      fill={fill}
      width={fill ? undefined : (variant?.width ?? media.width ?? undefined)}
      height={fill ? undefined : (variant?.height ?? media.height ?? undefined)}
      priority={priority}
      sizes={sizes}
      className={className}
      style={fill ? { objectFit: 'cover', objectPosition: focal } : undefined}
    />
  )
}
