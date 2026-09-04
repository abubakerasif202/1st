// Best-effort in-memory rate limiter. A single warm serverless instance shares
// this map; it is not a distributed limiter, but it blunts rapid abuse from one
// source without adding infrastructure. Pair it with the honeypot and the DB
// idempotency key for real duplicate protection.

import { HttpError } from './http'

interface Bucket {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

export function enforceRateLimit(key: string, limit: number, windowMs: number): void {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return
  }

  bucket.count += 1
  if (bucket.count > limit) {
    const retrySeconds = Math.ceil((bucket.resetAt - now) / 1000)
    throw new HttpError(429, `Too many requests. Try again in ${retrySeconds}s.`)
  }
}

// Keep the map from growing without bound on a long-lived instance.
if (typeof setInterval === 'function') {
  const timer = setInterval(() => {
    const now = Date.now()
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(key)
    }
  }, 60_000)
  // Do not keep the process alive just for cleanup.
  if (typeof timer.unref === 'function') timer.unref()
}
