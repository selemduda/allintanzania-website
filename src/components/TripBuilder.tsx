'use client'

import Image from 'next/image'
import React, { useEffect, useMemo, useState } from 'react'

import { EnquiryForm } from '@/components/EnquiryForm'
import { usd } from '@/lib/format'

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

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const TIERS: { value: Tier; label: string; body: string }[] = [
  { value: 'comfort', label: 'Comfort', body: 'Friendly tented camps and lodges with great locations.' },
  { value: 'classic', label: 'Classic', body: 'Our favourite mid-range camps: comfort, character, superb guiding.' },
  { value: 'luxury', label: 'Luxury', body: 'The finest lodges, private decks, exceptional food and service.' },
]

export function TripBuilder({
  destinations,
  initialStops,
  initialTier,
}: {
  destinations: BuilderDestination[]
  initialStops: Stop[]
  initialTier: Tier
}) {
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
    if (!stops.length) {
      setEstimate(null)
      return
    }
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
        if (!res.ok) throw new Error(data.error || 'Could not calculate')
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
  }, [trip, stops.length])

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
          <h3><span>1</span> Where would you like to go?</h3>
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
            <h3><span>2</span> Your route · {totalNights} nights</h3>
            <ol className="route">
              {stops.map((s, i) => (
                <li key={s.destination}>
                  <div className="route-order">
                    <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move earlier">↑</button>
                    <button type="button" onClick={() => move(i, 1)} disabled={i === stops.length - 1} aria-label="Move later">↓</button>
                  </div>
                  <strong>{byslug.get(s.destination)?.name}</strong>
                  <div className="stepper">
                    <button type="button" onClick={() => setNights(i, s.nights - 1)} aria-label="One night fewer">−</button>
                    <span>{s.nights} night{s.nights > 1 ? 's' : ''}</span>
                    <button type="button" onClick={() => setNights(i, s.nights + 1)} aria-label="One more night">+</button>
                  </div>
                  <button type="button" className="route-remove" onClick={() => toggle(s.destination)} aria-label="Remove">×</button>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="builder-step">
          <h3><span>{stops.length ? 3 : 2}</span> When and who?</h3>
          <div className="form-row">
            <div className="field">
              <label htmlFor="month">Travel month</label>
              <select id="month" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="adults">Adults</label>
              <input id="adults" type="number" min={1} max={30} value={adults} onChange={(e) => setAdults(Math.max(1, Number(e.target.value) || 1))} />
            </div>
            <div className="field">
              <label htmlFor="children">Children (under 16)</label>
              <input id="children" type="number" min={0} max={20} value={children} onChange={(e) => setChildren(Math.max(0, Number(e.target.value) || 0))} />
            </div>
          </div>
        </div>

        <div className="builder-step">
          <h3><span>{stops.length ? 4 : 3}</span> How would you like to stay?</h3>
          <div className="tier-picker">
            {TIERS.map((t) => (
              <button key={t.value} type="button" className={`tier ${tier === t.value ? 'on' : ''}`} onClick={() => setTier(t.value)} aria-pressed={tier === t.value}>
                <strong>{t.label}</strong>
                <small>{t.body}</small>
              </button>
            ))}
          </div>
        </div>
      </div>

      <aside className="builder-summary" aria-live="polite">
        <span className="eyebrow">Your estimate</span>
        {!stops.length && <p className="muted">Choose at least one destination to see a price.</p>}
        {error && <p className="notice notice-error">{error}</p>}
        {estimate && stops.length > 0 && (
          <div style={{ opacity: loading ? 0.5 : 1, transition: 'opacity .2s' }}>
            <div className="estimate-total">
              {usd(estimate.low)} – {usd(estimate.high)}
            </div>
            <p className="muted" style={{ marginBottom: 16 }}>
              About {usd(estimate.perPerson)} per person · {estimate.days} days · {estimate.travellers} traveller
              {estimate.travellers > 1 ? 's' : ''} · {estimate.season} season
            </p>
            <details className="estimate-lines">
              <summary>See what is included</summary>
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
                Send to my safari expert
              </button>
            ) : (
              <EnquiryForm source="builder" trip={trip} compact />
            )}
          </div>
        )}
      </aside>
    </div>
  )
}
