import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@ai-whisperers/auth/supabase/admin"
import { requireAdmin } from "@/lib/auth"

export async function GET(req: NextRequest) {
    const { error: authError } = await requireAdmin(req)
  if (authError) return authError
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("ej_notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
    const { error: authError } = await requireAdmin(req)
  if (authError) return authError
  const supabase = createAdminClient()
  const body = await req.json()
  const { type, title, body: noteBody, link } = body
  if (!title) return NextResponse.json({ error: "title requerido" }, { status: 400 })
  const { data, error } = await supabase.from("ej_notifications").insert({
    type: type || "info",
    title,
    body: noteBody || "",
    link: link || "",
  }).select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data?.[0] ?? null)
}

export async function PATCH(req: NextRequest) {
    const { error: authError } = await requireAdmin(req)
  if (authError) return authError
  const supabase = createAdminClient()
  const body = await req.json()
  const { id, read } = body
  if (!id) return NextResponse.json({ error: "id requerido" }, { status: 400 })
  const { error } = await supabase.from("ej_notifications").update({ read }).eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
    const { error: authError } = await requireAdmin(req)
  if (authError) return authError
  const supabase = createAdminClient()
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id requerido" }, { status: 400 })
  const { error } = await supabase.from("ej_notifications").delete().eq("id", parseInt(id))
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
