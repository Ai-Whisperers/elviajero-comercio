import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@ai-whisperers/auth/supabase/admin"
import { requireAdmin } from "@/lib/auth"

const CONFIG_KEY = "whatsapp_templates"

export async function GET(req: NextRequest) {
    const { error: authError } = await requireAdmin(req)
  if (authError) return authError
  const supabase = createAdminClient()
  const { data } = await supabase.from("ej_site_config").select("value").eq("key", CONFIG_KEY).single()
  return NextResponse.json(data?.value ?? [])
}

export async function POST(req: NextRequest) {
    const { error: authError } = await requireAdmin(req)
  if (authError) return authError
  const supabase = createAdminClient()
  const body = await req.json()
  const { error } = await supabase.from("ej_site_config").upsert({ key: CONFIG_KEY, value: body }, { onConflict: "key" })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
