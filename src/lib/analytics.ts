/**
 * Google Analytics 4, loaded only after the visitor accepts cookies (GDPR / ekomloven).
 * The measurement ID comes from GA_MEASUREMENT_ID in .env; without it there is no tracking and no banner.
 */

export const CONSENT_KEY = 'cookie-consent'
export type Consent = 'granted' | 'denied'

/** Event that opens the cookie banner again, sent by the "Cookie settings" link in the footer. */
export const OPEN_CONSENT_EVENT = 'open-cookie-settings'

/** Accepts only a real GA4 ID such as G-AB12CD34EF, so a typo in .env cannot inject anything. */
export const gaId = (value = process.env.GA_MEASUREMENT_ID): string | null =>
  value && /^G-[A-Z0-9]{4,20}$/.test(value.trim()) ? value.trim() : null

type Gtag = (...args: unknown[]) => void
declare global {
  interface Window {
    gtag?: Gtag
    dataLayer?: unknown[]
  }
}

/** Sends a GA4 event. Does nothing when analytics is off or the visitor declined. */
export function track(event: string, params: Record<string, string | number | undefined> = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') window.gtag('event', event, params)
}
