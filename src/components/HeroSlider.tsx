'use client'

import React, { useEffect, useState } from 'react'

type Slide = { key: string | number; eyebrow?: string | null; heading: string; image: React.ReactNode }

export function HeroSlider({ slides, children }: { slides: Slide[]; children?: React.ReactNode }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (slides.length < 2) return
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 7000)
    return () => clearInterval(timer)
  }, [slides.length])

  const current = slides[index]
  return (
    <section className="hero">
      <div className="hero-media">
        {slides.map((slide, i) => (
          <div key={slide.key} className={`hero-slide ${i === index ? 'is-active' : ''}`} aria-hidden={i !== index}>
            {slide.image}
          </div>
        ))}
      </div>
      <div className="container hero-content">
        {current?.eyebrow && <span className="eyebrow">{current.eyebrow}</span>}
        <h1>{current?.heading}</h1>
        {children}
        {slides.length > 1 && (
          <div className="hero-dots">
            {slides.map((slide, i) => (
              <button
                key={slide.key}
                className={i === index ? 'is-active' : ''}
                aria-label={`Show slide ${i + 1}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
