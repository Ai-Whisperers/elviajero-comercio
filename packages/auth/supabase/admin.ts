import { createClient } from "@supabase/supabase-js"

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL not set")

  // sb_secret_ format works directly as the second arg to createClient
  // Supabase-js handles it correctly by using it as the service role key
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  })
}
