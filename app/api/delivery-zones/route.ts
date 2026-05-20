import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@ai-whisperers/auth/supabase/admin"

const CONFIG_KEY = "delivery_zones"

export async function GET(_req: NextRequest) {
  const supabase = createAdminClient()
  const { data } = await supabase.from("ej_site_config").select("value").eq("key", CONFIG_KEY).single()
  return NextResponse.json(data?.value ?? [])
}
