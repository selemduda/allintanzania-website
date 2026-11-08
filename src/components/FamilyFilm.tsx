import React from 'react'

/** The family safari film, served from /public so it ships with the site. */
export const FAMILY_FILM = {
  src: '/video/family-safari-with-kids.mp4',
  poster: '/video/family-safari-with-kids.jpg',
}

export function FamilyFilm({ title }: { title: string }) {
  return (
    <video
      className="feature-film"
      src={FAMILY_FILM.src}
      poster={FAMILY_FILM.poster}
      controls
      preload="none"
      playsInline
      aria-label={title}
    />
  )
}
