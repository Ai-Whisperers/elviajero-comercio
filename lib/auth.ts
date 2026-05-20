import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { createClient } from "@supabase/supabase-js"

/**
 * Validates that the incoming request has an authenticated admin session.
 * Returns the user object if valid.
 * Returns a 401/403 NextResponse if not.
 */
export async function requireAdmin(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const allowedRoles = ["admin", "ventas", "bodega"]

  async function validateBearerToken(token: string) {
    const userResp = await fetch(`${url}/auth/v1/user`, {
      headers: { apikey: anonKey, Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
    if (!userResp.ok) return null
    const user = await userResp.json()
    if (!user?.id) return null

    const admin = createClient(url, serviceKey, { auth: { persistSession: false } })
    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profileError || !profile || !allowedRoles.includes(profile.role)) return null
    return user
  }

  const authHeader = req.headers.get("authorization") || ""
  const cookieToken = req.cookies.get("elviajero_admin_token")?.value || ""
  const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : cookieToken
  if (bearerToken) {
    try {
      const bearerUser = await validateBearerToken(bearerToken)
      if (bearerUser) return { error: null, user: bearerUser }
    } catch (err) {
      console.error("[requireAdmin] bearer validation failed", err)
    }
  }

  const response = NextResponse.next()
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return req.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return {
      error: NextResponse.json({ error: "Unauthorized", success: false }, { status: 401 }),
      user: null,
    }
  }

  const admin = createClient(url, serviceKey, { auth: { persistSession: false } })
  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profileError || !profile || !allowedRoles.includes(profile.role)) {
    return {
      error: NextResponse.json({ error: "Forbidden: admin role required", success: false }, { status: 403 }),
      user: null,
    }
  }

  return { error: null, user }
}
