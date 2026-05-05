import { NextRequest, NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase/admin"

// Content overrides live in a single row in ej_site_config
// Key: "content_overrides" — JSONB object that gets merged over content/es.json
// This means admins can edit ANY field and it shows instantly without rebuild

const CONFIG_KEY = "content_overrides"

export async function GET() {
  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from("ej_site_config")
    .select("value")
    .eq("key", CONFIG_KEY)
    .single()
  
  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(data?.value ?? null)
}

export async function POST(req: NextRequest) {
  const supabase = getAdminClient()
  const body = await req.json()
  
  // Upsert: replace entire overrides object
  const { data, error } = await supabase
    .from("ej_site_config")
    .upsert({ key: CONFIG_KEY, value: body }, { onConflict: "key" })
    .select()
    .single()
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data?.value ?? null)
}
