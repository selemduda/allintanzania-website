'use client'

import React, { useState } from 'react'

type Props = {
  source: 'contact' | 'builder' | 'ai'
  trip?: unknown
  compact?: boolean
}

export function EnquiryForm({ source, trip, compact }: Props) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('sending')
    const data = Object.fromEntries(new FormData(e.currentTarget))
    try {
      const res = await fetch('/api/enquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, source, trip }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Something went wrong')
      setState('sent')
    } catch (err) {
      setError((err as Error).message)
      setState('error')
    }
  }

  if (state === 'sent') {
    return (
      <p className="notice">
        Asante sana! Your safari expert will reply within one working day, usually much sooner.
      </p>
    )
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className={compact ? 'form' : 'form-row'}>
        <div className="field">
          <label htmlFor="enq-name">Your name</label>
          <input id="enq-name" name="name" required autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="enq-email">Email</label>
          <input id="enq-email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className="field">
          <label htmlFor="enq-phone">Phone or WhatsApp</label>
          <input id="enq-phone" name="phone" autoComplete="tel" />
        </div>
        {!compact && (
          <div className="field">
            <label htmlFor="enq-country">Country</label>
            <input id="enq-country" name="country" autoComplete="country-name" />
          </div>
        )}
      </div>
      {!trip && (
        <div className="form-row">
          <div className="field">
            <label htmlFor="enq-month">When would you like to travel?</label>
            <input id="enq-month" name="travelMonth" placeholder="e.g. July 2027" />
          </div>
          <div className="field">
            <label htmlFor="enq-adults">Adults</label>
            <input id="enq-adults" name="adults" type="number" min={1} defaultValue={2} />
          </div>
          <div className="field">
            <label htmlFor="enq-children">Children</label>
            <input id="enq-children" name="children" type="number" min={0} defaultValue={0} />
          </div>
        </div>
      )}
      <div className="field">
        <label htmlFor="enq-message">{trip ? 'Anything else we should know?' : 'Tell us about your dream safari'}</label>
        <textarea id="enq-message" name="message" rows={compact ? 3 : 6} />
      </div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden />
      {state === 'error' && <p className="notice notice-error">{error}</p>}
      <button className="btn btn-primary" disabled={state === 'sending'}>
        {state === 'sending' ? 'Sending…' : 'Send enquiry'}
      </button>
    </form>
  )
}
