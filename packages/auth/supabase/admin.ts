import { createClient } from "@supabase/supabase-js"

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  // The apikey header must be a JWT. Use the old anon key for apikey,
  // then override to service role via Authorization header.
  const anonJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dm9rcHJpYm1icm9zYWZudHFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzMTgxNTUsImV4cCI6MjA5MTg5NDE1NX0.ww_-gt4beuTcr_HbUCv0HmuKCw-J-HWTAI441yDSXRg"
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL not set")

  return createClient(url, anonJwt, {
    auth: { persistSession: false },
    global: serviceKey
      ? { headers: { Authorization: `Bearer ${serviceKey}` } }
      : {},
  })
}
