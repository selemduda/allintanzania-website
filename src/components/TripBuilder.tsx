'use client'

import Image from 'next/image'
import React, { useEffect, useMemo, useState } from 'react'

import { EnquiryForm } from '@/components/EnquiryForm'
import { usd } from '@/lib/format'
import { getDict, type Lang } from '@/lib/i18n'

export type BuilderDestination = {
  slug: string
  name: string
  tagline: string
  region: string
  nights: number
  image: string | null
}

type Stop = { destination: string; nights: number }
type Tier = 'comfort' | 'classic' | 'luxury'

type PublicEstimate = {
  season: string
  nights: number
  days: number
  travellers: number
  lines: { label: string; detail: string; amount: number }[]
  total: number
  low: number
  high: number
  perPerson: number
  notes: string[]
  disclaimer: string
}

const TIERS: Tier[] = ['comfort', 'classic', 'luxury']

export function TripBuilder({
  destinations,
  initialStops,
  initialTier,
  showPrices,
  lang,
}: {
  destinations: BuilderDestination[]
  initialStops: Stop[]
  initialTier: Tier
  /** When false the team quotes on request, so no estimate is fetched or shown. */
  showPrices: boolean
  lang: Lang
}) {
  const t = getDict(lang)
  const b = t.builder
  const [stops, setStops] = useState<Stop[]>(initialStops)
  const [month, setMonth] = useState(() => ((new Date().getMonth() + 3) % 12) + 1)
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [tier, setTier] = useState<Tier>(initialTier)
  const [estimate, setEstimate] = useState<PublicEstimate | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  const byslug = useMemo(() => new Map(destinations.map((d) => [d.slug, d])), [destinations])
  const trip = useMemo(() => ({ stops, month, adults, children, tier }), [stops, month, adults, children, tier])

  useEffect(() => {
    // With no stops the panel hides any previous estimate, so there is nothing to fetch.
    if (!showPrices || !stops.length) return
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setLoading(true)
      setError('')
      try {
        const res = await fetch('/api/estimate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(trip),
          signal: controller.signal,
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || b.couldNotCalculate)
        setEstimate(data.estimate)
      } catch (err) {
        if ((err as Error).name !== 'AbortError') setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [trip, stops.length, showPrices])

  const toggle = (slug: string) =>
    setStops((s) =>
      s.some((x) => x.destination === slug)
        ? s.filter((x) => x.destination !== slug)
        : [...s, { destination: slug, nights: byslug.get(slug)?.nights ?? 2 }],
    )
  const setNights = (i: number, nights: number) =>
    setStops((s) => s.map((x, j) => (j === i ? { ...x, nights: Math.max(1, Math.min(14, nights)) } : x)))
  const move = (i: number, dir: -1 | 1) =>
    setStops((s) => {
      const next = [...s]
      const j = i + dir
      if (j < 0 || j >= next.length) return s
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })

  const totalNights = stops.reduce((n, s) => n + s.nights, 0)

  return (
    <div className="builder">
      <div className="builder-main">
        <div className="builder-step">
          <h3><span>1</span> {b.where}</h3>
          <div className="dest-picker">
            {destinations.map((d) => {
              const on = stops.some((s) => s.destination === d.slug)
              return (
                <button key={d.slug} type="button" className={`dest-chip ${on ? 'on' : ''}`} onClick={() => toggle(d.slug)} aria-pressed={on}>
                  <span className="dest-chip-img">
                    {d.image ? <Image src={d.image} alt="" fill sizes="80px" style={{ objectFit: 'cover' }} /> : <span className="img-fallback" />}
                  </span>
                  <span>
                    <strong>{d.name}</strong>
                    <small>{d.tagline}</small>
                  </span>
                  <span className="dest-chip-check" aria-hidden>{on ? '✓' : '+'}</span>
                </button>
              )
            })}
          </div>
        </div>

        {stops.length > 0 && (
          <div className="builder-step">
            <h3><span>2</span> {b.route(totalNights)}</h3>
            <ol className="route">
              {stops.map((s, i) => (
                <li key={s.destination}>
                  <div className="route-order">
                    <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label={b.moveEarlier}>↑</button>
                    <button type="button" onClick={() => move(i, 1)} disabled={i === stops.length - 1} aria-label={b.moveLater}>↓</button>
                  </div>
                  <strong>{byslug.get(s.destination)?.name}</strong>
                  <div className="stepper">
                    <button type="button" onClick={() => setNights(i, s.nights - 1)} aria-label={b.fewer}>−</button>
                    <span>{t.nights(s.nights)}</span>
                    <button type="button" onClick={() => setNights(i, s.nights + 1)} aria-label={b.more}>+</button>
                  </div>
                  <button type="button" className="route-remove" onClick={() => toggle(s.destination)} aria-label={b.remove}>×</button>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="builder-step">
          <h3><span>{stops.length ? 3 : 2}</span> {b.whenWho}</h3>
          <div className="form-row">
            <div className="field">
              <label htmlFor="month">{b.month}</label>
              <select id="month" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                {t.months.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="adults">{b.adults}</label>
              <input id="adults" type="number" min={1} max={30} value={adults} onChange={(e) => setAdults(Math.max(1, Number(e.target.value) || 1))} />
            </div>
            <div className="field">
              <label htmlFor="children">{b.children}</label>
              <input id="children" type="number" min={0} max={20} value={children} onChange={(e) => setChildren(Math.max(0, Number(e.target.value) || 0))} />
            </div>
          </div>
        </div>

        <div className="builder-step">
          <h3><span>{stops.length ? 4 : 3}</span> {b.stay}</h3>
          <div className="tier-picker">
            {TIERS.map((value) => (
              <button key={value} type="button" className={`tier ${tier === value ? 'on' : ''}`} onClick={() => setTier(value)} aria-pressed={tier === value}>
                <strong>{t.tiers[value]}</strong>
                <small>{b.tierBodies[value]}</small>
              </button>
            ))}
          </div>
        </div>
      </div>

      <aside className="builder-summary" aria-live="polite">
        <span className="eyebrow">{showPrices ? b.yourEstimate : b.yourTrip}</span>
        {!stops.length && (
          <p className="muted">
            {showPrices ? b.chooseForPrice : b.chooseToStart}
          </p>
        )}
        {!showPrices && stops.length > 0 && (
          <div>
            <ul className="trip-outline">
              {stops.map((s) => (
                <li key={s.destination}>
                  <span>{byslug.get(s.destination)?.name ?? s.destination}</span>
                  <span className="muted">{t.nights(s.nights)}</span>
                </li>
              ))}
            </ul>
            <p className="muted" style={{ marginBottom: 16 }}>
              {t.days(totalNights + 1)} · {t.travellers(adults + children)} · {t.months[month - 1]} · {t.tiers[tier]}
            </p>
            <p className="estimate-total" style={{ fontSize: '1.6rem' }}>{b.priceOnRequest}</p>
            <p className="muted small">{b.tailorMade}</p>
            {!showForm ? (
              <button type="button" className="btn btn-primary" style={{ width: '100%' }} onClick={() => setShowForm(true)}>
                {b.requestQuote}
              </button>
            ) : (
              <EnquiryForm source="builder" trip={trip} compact lang={lang} />
            )}
          </div>
        )}
        {error && <p className="notice notice-error">{error}</p>}
        {estimate && stops.length > 0 && (
          <div style={{ opacity: loading ? 0.5 : 1, transition: 'opacity .2s' }}>
            <div className="estimate-total">
              {usd(estimate.low)} – {usd(estimate.high)}
            </div>
            <p className="muted" style={{ marginBottom: 16 }}>
              {b.about} {usd(estimate.perPerson)} {b.perPerson} · {t.days(estimate.days)} · {t.travellers(estimate.travellers)} ·{' '}
              {b.season(estimate.season)}
            </p>
            <details className="estimate-lines">
              <summary>{b.included}</summary>
              <ul>
                {estimate.lines.map((l, i) => (
                  <li key={i}>
                    <span>{l.label}<small>{l.detail}</small></span>
                    <span>{usd(l.amount)}</span>
                  </li>
                ))}
              </ul>
            </details>
            {estimate.notes.map((n) => <p key={n} className="muted small">{n}</p>)}
            <p className="muted small">{estimate.disclaimer}</p>
            {!showForm ? (
              <button type="button" className="btn btn-primary" style={{ width: '100%' }} onClick={() => setShowForm(true)}>
                {b.sendToExpert}
              </button>
            ) : (
              <EnquiryForm source="builder" trip={trip} compact lang={lang} />
            )}
          </div>
        )}
      </aside>
    </div>
  )
}
