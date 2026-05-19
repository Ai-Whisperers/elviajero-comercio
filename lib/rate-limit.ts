import { NextRequest, NextResponse } from "next/server"

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

const WINDOW_MS = 60_000 // 1 minute
const MAX_REQUESTS = 100 // 100 requests per minute per IP

function getKey(ip: string) {
  return `ratelimit:${ip}`
}

export function rateLimit(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
  const key = getKey(ip)
  const now = Date.now()

  const entry = store.get(key)
  if (entry && entry.resetAt > now) {
    if (entry.count >= MAX_REQUESTS) {
      return {
        allowed: false,
        response: NextResponse.json(
          { error: "Too many requests. Try again later.", success: false },
          { status: 429, headers: { "Retry-After": String(Math.ceil((entry.resetAt - now) / 1000)) } }
        ),
      }
    }
    entry.count++
    return { allowed: true, response: null }
  }

  // New window
  store.set(key, { count: 1, resetAt: now + WINDOW_MS })

  // Cleanup old entries periodically (simple eviction)
  if (store.size > 10_000) {
    store.forEach((v, k) => {
      if (v.resetAt <= now) store.delete(k)
    })
  }

  return { allowed: true, response: null }
}
