import { NextRequest, NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase/admin"

const TABLE = "ej_promo_codes"

export async function GET() {
  const supabase = getAdminClient()
  const { data, error } = await supabase.from(TABLE).select("*")
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
  const supabase = getAdminClient()
  const body = await req.json()
  const { data, error } = await supabase.from(TABLE).insert(body).select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data?.[0] ?? null)
}

export async function PATCH(req: NextRequest) {
  const supabase = getAdminClient()
  const body = await req.json()
  const { original_code, ...updates } = body
  const query = supabase.from(TABLE).update(updates)
  const code = original_code || body.code
  if (code) query.eq("code", code)
  const { data, error } = await query.select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data?.[0] ?? null)
}

export async function DELETE(req: NextRequest) {
  const supabase = getAdminClient()
  const { searchParams } = new URL(req.url)
  const code = searchParams.get("code")
  if (!code) return NextResponse.json({ error: "code required" }, { status: 400 })
  const { error } = await supabase.from(TABLE).delete().eq("code", code)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
