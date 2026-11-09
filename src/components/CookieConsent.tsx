'use client'

import React, { useEffect, useState, useSyncExternalStore } from 'react'

import { CONSENT_KEY, OPEN_CONSENT_EVENT, type Consent } from '@/lib/analytics'
import type { Dict } from '@/lib/i18n'

type Text = Dict['cookies']

const CHANGE_EVENT = 'cookie-consent-change'

/** 'unset' until the visitor chooses; 'server' while rendering on the server, so nothing shows before hydration. */
const readConsent = (): Consent | 'unset' => {
  try {
    const v = window.localStorage.getItem(CONSENT_KEY)
    return v === 'granted' || v === 'denied' ? v : 'unset'
  } catch {
    return 'unset'
  }
}

const subscribe = (onChange: () => void) => {
  window.addEventListener(CHANGE_EVENT, onChange)
  window.addEventListener('storage', onChange)
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange)
    window.removeEventListener('storage', onChange)
  }
}

const saveConsent = (v: Consent) => {
  try {
    window.localStorage.setItem(CONSENT_KEY, v)
  } catch {
    // Private mode or blocked storage: the choice is not remembered after this page.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

function loadAnalytics(id: string) {
  ;(window as unknown as Record<string, unknown>)[`ga-disable-${id}`] = false
  if (window.gtag) return
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    // gtag.js expects the arguments object itself, not an array.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', id)
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`
  document.head.appendChild(s)
}

/** Stops Google Analytics and removes its cookies when the visitor withdraws consent. */
function stopAnalytics(id: string) {
  ;(window as unknown as Record<string, unknown>)[`ga-disable-${id}`] = true
  const host = window.location.hostname
  const domains = ['', host, `.${host}`, `.${host.split('.').slice(-2).join('.')}`]
  for (const c of document.cookie.split(';')) {
    const name = c.split('=')[0].trim()
    if (!/^_ga/.test(name)) continue
    for (const d of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ''}`
    }
  }
}

/** Banner asking for consent to analytics cookies, in the page language. */
export function CookieConsent({ gaId, t }: { gaId: string; t: Text }) {
  const consent = useSyncExternalStore(subscribe, readConsent, () => 'server' as const)
  const [reopened, setReopened] = useState(false)

  useEffect(() => {
    if (consent === 'granted') loadAnalytics(gaId)
  }, [consent, gaId])

  useEffect(() => {
    const reopen = () => setReopened(true)
    window.addEventListener(OPEN_CONSENT_EVENT, reopen)
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen)
  }, [])

  const choose = (v: Consent) => {
    if (v === 'denied') stopAnalytics(gaId)
    saveConsent(v)
    setReopened(false)
  }

  if (consent === 'server' || (consent !== 'unset' && !reopened)) return null
  return (
    <div className="cookie-banner" role="dialog" aria-live="polite" aria-label={t.title}>
      <div className="cookie-text">
        <strong>{t.title}</strong>
        <p>{t.text}</p>
      </div>
      <div className="cookie-actions">
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => choose('denied')}>
          {t.decline}
        </button>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => choose('granted')}>
          {t.accept}
        </button>
      </div>
    </div>
  )
}

/** Footer link that opens the banner again, so visitors can change their mind. */
export function CookieSettingsLink({ label }: { label: string }) {
  return (
    <button type="button" className="link-button" onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}>
      {label}
    </button>
  )
}
