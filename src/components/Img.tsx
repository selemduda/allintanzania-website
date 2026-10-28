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
  const variant = size ? media.sizes?.[size] : undefined
  const src = mediaPath(variant?.url || media.url)!
  const focal =
    media.focalX != null && media.focalY != null ? `${media.focalX}% ${media.focalY}%` : 'center'
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
