import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { DestinationTile, SafariCard } from '@/components/Cards'
import { FamilyFilm } from '@/components/FamilyFilm'
import { HeroSlider } from '@/components/HeroSlider'
import { Img } from '@/components/Img'
import { rel } from '@/lib/format'
import { getDict, localePath } from '@/lib/i18n'
import { pageLang } from '@/lib/pageLang'
import { getPayloadClient, getPublicExpert } from '@/lib/payload'
import { pageMeta } from '@/lib/seo'
import type { Destination, Itinerary } from '@/payload-types'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return pageMeta({ lang: await pageLang(params), path: '/' })
}

export default async function HomePage({ params }: Props) {
  const lang = await pageLang(params)
  const t = getDict(lang)
  const href = (path: string) => localePath(lang, path)
  const payload = await getPayloadClient()
  const [home, expert] = await Promise.all([
    payload.findGlobal({ slug: 'home-page', depth: 2, locale: lang }),
    getPublicExpert(lang),
  ])

  let destinations = (home.featuredDestinations ?? []).map(rel).filter(Boolean) as Destination[]
  if (!destinations.length) {
    destinations = (
      await payload.find({ collection: 'destinations', where: { _status: { equals: 'published' } }, limit: 6, sort: 'order', locale: lang })
    ).docs
  }
  let safaris = (home.featuredItineraries ?? []).map(rel).filter(Boolean) as Itinerary[]
  if (!safaris.length) {
    safaris = (
      await payload.find({ collection: 'itineraries', where: { _status: { equals: 'published' } }, limit: 3, locale: lang })
    ).docs
  }

  const slides = (home.heroSlides ?? []).map((s, i) => ({
    key: s.id ?? i,
    eyebrow: s.eyebrow,
    heading: s.heading,
    image: <Img media={s.image} size="hero" priority={i === 0} />,
  }))
  if (!slides.length) {
    slides.push({ key: 'default', eyebrow: t.home.defaultEyebrow, heading: t.home.defaultHeading, image: <Img /> })
  }

  return (
    <>
      <HeroSlider slides={slides}>
        {home.heroSubheading && <p className="lead">{home.heroSubheading}</p>}
        <div className="hero-actions">
          <Link href={href('/plan')} className="btn btn-primary">{t.buildDream}</Link>
          <Link href={href('/expert')} className="btn btn-ghost">{t.home.talkTo(expert.name)}</Link>
        </div>
      </HeroSlider>

      {home.intro?.heading && (
        <section className="section">
          <div className="container split">
            <div>
              <span className="eyebrow">Karibu Tanzania</span>
              <h2>{home.intro.heading}</h2>
              {home.intro.body?.split('\n\n').map((p, i) => <p key={i} className="lead">{p}</p>)}
              <Link href={href('/about')} className="link-arrow">{t.home.ourStory}</Link>
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
                <span className="eyebrow">{t.home.destinationsEyebrow}</span>
                <h2>{t.home.destinationsHeading}</h2>
              </div>
              <Link href={href('/destinations')} className="link-arrow">{t.home.allDestinations}</Link>
            </div>
            <div className="grid grid-3">
              {destinations.slice(0, 6).map((d) => <DestinationTile key={d.id} d={d} lang={lang} />)}
            </div>
          </div>
        </section>
      )}

      {safaris.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="eyebrow">{t.home.safarisEyebrow}</span>
                <h2>{t.home.safarisHeading}</h2>
              </div>
              <Link href={href('/safaris')} className="link-arrow">{t.home.allSafaris}</Link>
            </div>
            <div className="grid grid-3">
              {safaris.map((s) => <SafariCard key={s.id} s={s} lang={lang} />)}
            </div>
          </div>
        </section>
      )}

      <section className="section section-sand">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">{t.home.filmEyebrow}</span>
              <h2>{t.home.filmHeading}</h2>
              <p className="lead" style={{ maxWidth: '52ch' }}>{t.home.filmBody}</p>
            </div>
            <Link href={href('/plan')} className="link-arrow">{t.home.filmCta}</Link>
          </div>
          <FamilyFilm title={t.home.filmHeading} />
        </div>
      </section>

      {home.pillars && home.pillars.length > 0 && (
        <section className="section section-dark">
          <div className="container">
            <span className="eyebrow">{t.home.whyEyebrow}</span>
            <h2 style={{ maxWidth: '18ch', marginBottom: 48 }}>{t.home.whyHeading}</h2>
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
            <span className="eyebrow">{t.home.expertEyebrow}</span>
            <h2>{home.expertBanner?.heading || t.home.planWith(expert.name)}</h2>
            <p className="lead">{home.expertBanner?.body || t.home.expertBody}</p>
            <div className="hero-actions">
              <Link href={href('/expert')} className="btn btn-primary">{t.home.startConversation}</Link>
              <Link href={href('/plan')} className="btn btn-ghost">{t.home.buildMyTrip}</Link>
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
