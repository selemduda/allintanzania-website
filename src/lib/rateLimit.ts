/**
 * Small in-memory limiter per IP. Good enough for a single DigitalOcean server;
 * move to Redis if the site ever runs on more than one instance.
 */
const hits = new Map<string, { count: number; reset: number }>()

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const entry = hits.get(key)
  if (!entry || entry.reset < now) {
    hits.set(key, { count: 1, reset: now + windowMs })
    return true
  }
  entry.count++
  return entry.count <= limit
}

export const clientIp = (req: Request) =>
  req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || 'local'
