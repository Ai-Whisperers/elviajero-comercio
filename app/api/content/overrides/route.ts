import { NextResponse } from "next/server"
import { createAdminClient } from "@ai-whisperers/auth/supabase/admin"

const CONFIG_KEY = "content_overrides"

export async function GET() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("ej_site_config")
    .select("value")
    .eq("key", CONFIG_KEY)
    .single()

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data?.value ?? {})
}
