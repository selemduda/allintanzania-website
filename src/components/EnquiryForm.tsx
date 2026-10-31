'use client'

import React, { useState } from 'react'

import { getDict, type Lang } from '@/lib/i18n'

import { CountrySelect } from './CountrySelect'
import { MonthPicker } from './MonthPicker'

type Props = {
  source: 'contact' | 'builder' | 'ai'
  trip?: unknown
  compact?: boolean
  lang: Lang
}

export function EnquiryForm({ source, trip, compact, lang }: Props) {
  const t = getDict(lang).form
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
        body: JSON.stringify({ ...data, source, trip, language: lang }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || t.error)
      setState('sent')
    } catch (err) {
      setError((err as Error).message)
      setState('error')
    }
  }

  if (state === 'sent') {
    return (
      <p className="notice">{t.sent}</p>
    )
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className={compact ? 'form' : 'form-row'}>
        <div className="field">
          <label htmlFor="enq-name">{t.name}</label>
          <input id="enq-name" name="name" required autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="enq-email">{t.email}</label>
          <input id="enq-email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className="field">
          <label htmlFor="enq-phone">{t.phone}</label>
          <input id="enq-phone" name="phone" autoComplete="tel" />
        </div>
        {!compact && (
          <div className="field">
            <label htmlFor="enq-country">{t.country}</label>
            <CountrySelect id="enq-country" name="country" lang={lang} />
          </div>
        )}
      </div>
      {!trip && (
        <div className="form-row">
          <div className="field">
            <label htmlFor="enq-month">{t.when}</label>
            <MonthPicker id="enq-month" name="travelMonth" lang={lang} />
          </div>
          <div className="field">
            <label htmlFor="enq-adults">{t.adults}</label>
            <input id="enq-adults" name="adults" type="number" min={1} defaultValue={2} />
          </div>
          <div className="field">
            <label htmlFor="enq-children">{t.children}</label>
            <input id="enq-children" name="children" type="number" min={0} defaultValue={0} />
          </div>
        </div>
      )}
      <div className="field">
        <label htmlFor="enq-message">{trip ? t.anythingElse : t.tellUs}</label>
        <textarea id="enq-message" name="message" rows={compact ? 3 : 6} />
      </div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden />
      {state === 'error' && <p className="notice notice-error">{error}</p>}
      <button className="btn btn-primary" disabled={state === 'sending'}>
        {state === 'sending' ? t.sending : t.send}
      </button>
    </form>
  )
}
