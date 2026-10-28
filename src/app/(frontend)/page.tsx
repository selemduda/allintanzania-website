import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { DestinationTile, SafariCard } from '@/components/Cards'
import { HeroSlider } from '@/components/HeroSlider'
import { Img } from '@/components/Img'
import { rel } from '@/lib/format'
import { getPayloadClient, getPublicExpert } from '@/lib/payload'
import type { Destination, Itinerary } from '@/payload-types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { alternates: { canonical: '/' } }

export default async function HomePage() {
  const payload = await getPayloadClient()
  const [home, expert] = await Promise.all([
    payload.findGlobal({ slug: 'home-page', depth: 2 }),
    getPublicExpert(),
  ])

  let destinations = (home.featuredDestinations ?? []).map(rel).filter(Boolean) as Destination[]
  if (!destinations.length) {
    destinations = (
      await payload.find({ collection: 'destinations', where: { _status: { equals: 'published' } }, limit: 6, sort: 'order' })
    ).docs
  }
  let safaris = (home.featuredItineraries ?? []).map(rel).filter(Boolean) as Itinerary[]
  if (!safaris.length) {
    safaris = (
      await payload.find({ collection: 'itineraries', where: { _status: { equals: 'published' } }, limit: 3 })
    ).docs
  }

  const slides = (home.heroSlides ?? []).map((s, i) => ({
    key: s.id ?? i,
    eyebrow: s.eyebrow,
    heading: s.heading,
    image: <Img media={s.image} size="hero" priority={i === 0} />,
  }))
  if (!slides.length) {
    slides.push({ key: 'default', eyebrow: 'Tailor-made Tanzania safaris', heading: 'Where the wild still roams free', image: <Img /> })
  }

  return (
    <>
      <HeroSlider slides={slides}>
        {home.heroSubheading && <p className="lead">{home.heroSubheading}</p>}
        <div className="hero-actions">
          <Link href="/plan" className="btn btn-primary">Build your dream safari</Link>
          <Link href="/expert" className="btn btn-ghost">Talk to {expert.name}</Link>
        </div>
      </HeroSlider>

      {home.intro?.heading && (
        <section className="section">
          <div className="container split">
            <div>
              <span className="eyebrow">Karibu Tanzania</span>
              <h2>{home.intro.heading}</h2>
              {home.intro.body?.split('\n\n').map((p, i) => <p key={i} className="lead">{p}</p>)}
              <Link href="/about" className="link-arrow">Our story</Link>
            </div>
            <div className="split-media">
              <Img media={home.intro.image} size="card" sizes="(max-width: 860px) 100vw, 50vw" />
            </div>
          </div>
        </section>
      )}

      {destinations.length > 0 && (
        <section className="section section-sand">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="eyebrow">Destinations</span>
                <h2>From crater floor to coral reef</h2>
              </div>
              <Link href="/destinations" className="link-arrow">All destinations</Link>
            </div>
            <div className="grid grid-3">
              {destinations.slice(0, 6).map((d) => <DestinationTile key={d.id} d={d} />)}
            </div>
          </div>
        </section>
      )}

      {safaris.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="eyebrow">Signature safaris</span>
                <h2>Journeys we love to plan</h2>
              </div>
              <Link href="/safaris" className="link-arrow">All safaris</Link>
            </div>
            <div className="grid grid-3">
              {safaris.map((s) => <SafariCard key={s.id} s={s} />)}
            </div>
          </div>
        </section>
      )}

      {home.pillars && home.pillars.length > 0 && (
        <section className="section section-dark">
          <div className="container">
            <span className="eyebrow">Why All in Tanzania</span>
            <h2 style={{ maxWidth: '18ch', marginBottom: 48 }}>Safaris planned by people who live them</h2>
            <div className="pillars">
              {home.pillars.map((p) => (
                <div key={p.id}>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container split">
          <div className="split-media">
            <Img media={home.expertBanner?.image} size="card" sizes="(max-width: 860px) 100vw, 50vw" />
          </div>
          <div>
            <span className="eyebrow">Ask a local expert</span>
            <h2>{home.expertBanner?.heading || `Plan with ${expert.name}, day or night`}</h2>
            <p className="lead">
              {home.expertBanner?.body ||
                'Ask anything: when to see the calving season, which camp suits young children, how long to stay in Ruaha. Type or simply talk, and shape your trip together.'}
            </p>
            <div className="hero-actions">
              <Link href="/expert" className="btn btn-primary">Start a conversation</Link>
              <Link href="/plan" className="btn btn-ghost">Build my trip</Link>
            </div>
          </div>
        </div>
      </section>

      {home.testimonials && home.testimonials.length > 0 && (
        <section className="section section-sand">
          <div className="container">
            <p className="quote">“{home.testimonials[0].quote}”</p>
            <p className="quote-author">
              {home.testimonials[0].author}
              {home.testimonials[0].origin ? ` · ${home.testimonials[0].origin}` : ''}
            </p>
          </div>
        </section>
      )}
    </>
  )
}
