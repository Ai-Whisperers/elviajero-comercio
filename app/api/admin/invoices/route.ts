import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@ai-whisperers/auth/supabase/admin"
import { requireAdmin } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const { error: authError } = await requireAdmin(req)
  if (authError) return authError
  const supabase = createAdminClient()
  const { searchParams } = new URL(req.url)
  const orderId = searchParams.get("orderId")

  let query = supabase.from("ej_invoices").select("*").order("created_at", { ascending: false })
  if (orderId) query = query.eq("order_id", orderId)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
  const { error: authError } = await requireAdmin(req)
  if (authError) return authError
  const supabase = createAdminClient()
  const body = await req.json()

  const { data, error } = await supabase.from("ej_invoices").insert(body).select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data?.[0] ?? null)
}

export async function PATCH(req: NextRequest) {
  const { error: authError } = await requireAdmin(req)
  if (authError) return authError
  const supabase = createAdminClient()
  const body = await req.json()
  const { number, status } = body
  if (!number) return NextResponse.json({ error: "Missing number" }, { status: 400 })

  const { error } = await supabase.from("ej_invoices").update({ status }).eq("number", number)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
