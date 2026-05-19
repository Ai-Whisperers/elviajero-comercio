import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@ai-whisperers/auth/supabase/admin"
import { requireAdmin } from "@/lib/auth"

const CONFIG_KEY = "abandoned_carts"

export async function GET(req: NextRequest) {
    const { error: authError } = await requireAdmin(req)
  if (authError) return authError
  const supabase = createAdminClient()
  const { data } = await supabase.from("ej_site_config").select("value").eq("key", CONFIG_KEY).single()
  return NextResponse.json(data?.value ?? [])
}

export async function PATCH(req: NextRequest) {
    const { error: authError } = await requireAdmin(req)
  if (authError) return authError
  const supabase = createAdminClient()
  const body = await req.json()
  const { id, recovered } = body
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  const { data: existing } = await supabase.from("ej_site_config").select("value").eq("key", CONFIG_KEY).single()
  let carts = Array.isArray(existing?.value) ? existing.value : []
  carts = carts.map((c: any) => c.id === id ? { ...c, recovered, updated_at: new Date().toISOString() } : c)

  const { error } = await supabase.from("ej_site_config").upsert({ key: CONFIG_KEY, value: carts }, { onConflict: "key" })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
