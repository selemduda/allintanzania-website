export const usd = (n: number | null | undefined) =>
  n == null
    ? ''
    : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

export const rel = <T extends object>(v: T | number | null | undefined): T | null =>
  v && typeof v === 'object' ? v : null

/** Payload returns absolute media URLs when serverURL is set; next/image wants same-origin paths. */
export const mediaPath = (url: string | null | undefined) => {
  if (!url) return null
  try {
    const parsed = new URL(url)
    return parsed.pathname.startsWith('/api/media/') ? parsed.pathname + parsed.search : url
  } catch {
    return url
  }
}
