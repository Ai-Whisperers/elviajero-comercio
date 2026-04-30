
import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

const TOKEN_HEADER = "x-csrf-token"
const TOKEN_COOKIE = "csrf_token"

export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

export function validateCsrf(req: NextRequest): boolean {
  const cookieToken = req.cookies.get(TOKEN_COOKIE)?.value
  const headerToken = req.headers.get(TOKEN_HEADER)
  if (!cookieToken || !headerToken) return false
  try {
    return crypto.timingSafeEqual(Buffer.from(cookieToken), Buffer.from(headerToken))
  } catch {
    return false
  }
}

export function withCsrfProtection(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    if (req.method === "GET") return handler(req)
    if (!validateCsrf(req)) {
      return NextResponse.json({ error: "CSRF validation failed" }, { status: 403 })
    }
    return handler(req)
  }
}
