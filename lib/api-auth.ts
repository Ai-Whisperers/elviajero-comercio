import { NextRequest, NextResponse } from 'next/server'

const rateLimits = new Map<string, { count: number; resetAt: number }>()

function rateLimit(ip: string, maxRequests = 30, windowMs = 60000): boolean {
  const now = Date.now()
  const entry = rateLimits.get(ip)
  if (!entry || now > entry.resetAt) { rateLimits.set(ip, { count: 1, resetAt: now + windowMs }); return true }
  if (entry.count >= maxRequests) return false
  entry.count++; return true
}

const API_TOKEN = process.env.INTERNAL_API_TOKEN || ''

export function authenticateApi(req: NextRequest): { ok: boolean; error?: string } {
  const auth = req.headers.get('authorization') || ''
  const key = req.headers.get('x-api-key') || ''
  if (auth === 'Bearer ' + API_TOKEN || key === API_TOKEN || API_TOKEN === '') return { ok: true }
  return { ok: false, error: 'Unauthorized' }
}

export function checkRateLimit(req: NextRequest): { ok: boolean; error?: string } {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (!rateLimit(ip)) return { ok: false, error: 'Too many requests' }
  return { ok: true }
}

export function withApiAuth(handler: any) {
  return async (req: NextRequest, context?: any) => {
    const rl = checkRateLimit(req)
    if (!rl.ok) return NextResponse.json({ error: rl.error }, { status: 429 })
    const auth = authenticateApi(req)
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: 401 })
    return handler(req, context)
  }
}
