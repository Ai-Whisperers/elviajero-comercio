import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@ai-whisperers/auth/supabase/admin"
import { requireAdmin } from "@/lib/auth"
import { ContentOverrideSchema } from "@/lib/validation"

// Content overrides live in a single row in ej_site_config
// Key: "content_overrides" — JSONB object that gets merged over content/es.json
// This means admins can edit ANY field and it shows instantly without rebuild

const CONFIG_KEY = "content_overrides"

export async function GET(req: NextRequest) {
    const { error: authError } = await requireAdmin(req)
  if (authError) return authError
  const supabase = createAdminClient()
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
    const { error: authError } = await requireAdmin(req)
  if (authError) return authError
  const supabase = createAdminClient()
  const body = await req.json()
  
  const parsed = ContentOverrideSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues.map((e) => e.message).join(", ") }, { status: 400 })
  }
  
  // Upsert: replace entire overrides object
  const { data, error } = await supabase
    .from("ej_site_config")
    .upsert({ key: CONFIG_KEY, value: parsed.data }, { onConflict: "key" })
    .select()
    .single()
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data?.value ?? null)
}
