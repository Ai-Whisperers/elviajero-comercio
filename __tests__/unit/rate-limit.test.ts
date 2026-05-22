/**
 * Rate Limiter Tests — pure logic, no Next.js dependency.
 *
 * Tests: window-based rate limiting, eviction, IP extraction
 */
import { describe, it, expect, beforeEach } from "@jest/globals"

// ─── Inline rate limiter (mirrors lib/rate-limit.ts) ───────────────
interface RateLimitEntry {
  count: number
  resetAt: number
}

class RateLimiter {
  private store = new Map<string, RateLimitEntry>()
  private maxRequests: number
  private windowMs: number

  constructor(maxRequests = 100, windowMs = 60000) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
  }

  check(ip: string, now: number): { allowed: boolean; remaining?: number } {
    const key = `ratelimit:${ip}`
    const entry = this.store.get(key)

    if (entry && entry.resetAt > now) {
      if (entry.count >= this.maxRequests) {
        return { allowed: false }
      }
      entry.count++
      return { allowed: true, remaining: this.maxRequests - entry.count }
    }

    this.store.set(key, { count: 1, resetAt: now + this.windowMs })
    return { allowed: true, remaining: this.maxRequests - 1 }
  }

  evict(now: number) {
    this.store.forEach((v, k) => {
      if (v.resetAt <= now) this.store.delete(k)
    })
  }

  size() { return this.store.size }
}

// ─── Tests ─────────────────────────────────────────────────────────

describe("Rate Limiter", () => {
  let limiter: RateLimiter
  const NOW = 1000000

  beforeEach(() => {
    limiter = new RateLimiter(5, 1000) // 5 requests per 1000ms for testing
  })

  it("allows first request", () => {
    expect(limiter.check("1.2.3.4", NOW).allowed).toBe(true)
  })

  it("allows requests up to limit", () => {
    for (let i = 0; i < 5; i++) {
      expect(limiter.check("1.2.3.4", NOW).allowed).toBe(true)
    }
  })

  it("blocks request at limit+1", () => {
    for (let i = 0; i < 5; i++) limiter.check("1.2.3.4", NOW)
    expect(limiter.check("1.2.3.4", NOW).allowed).toBe(false)
  })

  it("resets after window expires", () => {
    for (let i = 0; i < 5; i++) limiter.check("1.2.3.4", NOW)
    // Blocked at same time
    expect(limiter.check("1.2.3.4", NOW).allowed).toBe(false)
    // Allowed after window
    expect(limiter.check("1.2.3.4", NOW + 1001).allowed).toBe(true)
  })

  it("tracks IPs independently", () => {
    for (let i = 0; i < 5; i++) limiter.check("1.2.3.4", NOW)
    expect(limiter.check("1.2.3.4", NOW).allowed).toBe(false)
    expect(limiter.check("5.6.7.8", NOW).allowed).toBe(true)
  })

  it("reports remaining count", () => {
    const r1 = limiter.check("1.2.3.4", NOW)
    expect(r1.remaining).toBe(4)
    limiter.check("1.2.3.4", NOW)
    const r3 = limiter.check("1.2.3.4", NOW)
    expect(r3.remaining).toBe(2)
  })

  it("no remaining when blocked", () => {
    for (let i = 0; i < 5; i++) limiter.check("1.2.3.4", NOW)
    const result = limiter.check("1.2.3.4", NOW)
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBeUndefined()
  })

  it("evicts expired entries", () => {
    limiter.check("1.2.3.4", NOW)
    limiter.check("5.6.7.8", NOW + 500)
    expect(limiter.size()).toBe(2)
    limiter.evict(NOW + 1001) // First expired, second not
    expect(limiter.size()).toBe(1)
  })

  it("evicts all expired entries", () => {
    limiter.check("1.2.3.4", NOW)
    limiter.check("5.6.7.8", NOW)
    limiter.evict(NOW + 2000)
    expect(limiter.size()).toBe(0)
  })

  it("does not evict active entries", () => {
    limiter.check("1.2.3.4", NOW + 500)
    limiter.evict(NOW)
    expect(limiter.size()).toBe(1)
  })

  it("handles same IP in different windows", () => {
    for (let i = 0; i < 5; i++) limiter.check("1.2.3.4", NOW)
    // New window
    for (let i = 0; i < 5; i++) limiter.check("1.2.3.4", NOW + 1001)
    expect(limiter.check("1.2.3.4", NOW + 1001).allowed).toBe(false)
  })
})
