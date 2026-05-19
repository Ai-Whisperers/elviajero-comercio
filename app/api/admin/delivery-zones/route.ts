import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@ai-whisperers/auth/supabase/admin"
import { requireAdmin } from "@/lib/auth"

const CONFIG_KEY = "delivery_zones"

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
  const { data: existing } = await supabase.from("ej_site_config").select("value").eq("key", CONFIG_KEY).single()
  const zones = Array.isArray(existing?.value) ? existing.value : []
  const newZone = { id: crypto.randomUUID(), ...body, created_at: new Date().toISOString() }
  zones.push(newZone)
  const { error } = await supabase.from("ej_site_config").upsert({ key: CONFIG_KEY, value: zones }, { onConflict: "key" })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(newZone)
}

export async function PATCH(req: NextRequest) {
    const { error: authError } = await requireAdmin(req)
  if (authError) return authError
  const supabase = createAdminClient()
  const body = await req.json()
  const { data: existing } = await supabase.from("ej_site_config").select("value").eq("key", CONFIG_KEY).single()
  let zones = Array.isArray(existing?.value) ? existing.value : []
  zones = zones.map((z: any) => z.id === body.id ? { ...z, ...body, updated_at: new Date().toISOString() } : z)
  const { error } = await supabase.from("ej_site_config").upsert({ key: CONFIG_KEY, value: zones }, { onConflict: "key" })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(body)
}

export async function DELETE(req: NextRequest) {
    const { error: authError } = await requireAdmin(req)
  if (authError) return authError
  const supabase = createAdminClient()
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
  const { data: existing } = await supabase.from("ej_site_config").select("value").eq("key", CONFIG_KEY).single()
  const zones = (Array.isArray(existing?.value) ? existing.value : []).filter((z: any) => z.id !== id)
  const { error } = await supabase.from("ej_site_config").upsert({ key: CONFIG_KEY, value: zones }, { onConflict: "key" })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
