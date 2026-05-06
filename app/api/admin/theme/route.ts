import { NextRequest, NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase/admin"

const TABLE = "ej_admin_themes"

export async function GET() {
  const supabase = getAdminClient()
  const { data } = await supabase.from(TABLE).select("*").maybeSingle()
  return NextResponse.json(data ?? null)
}

export async function POST(req: NextRequest) {
  const supabase = getAdminClient()
  const body = await req.json()
  const { data: existing } = await supabase.from(TABLE).select("id").maybeSingle()
  if (existing) {
    const { error } = await supabase.from(TABLE).update(body).eq("id", existing.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }
  const { error } = await supabase.from(TABLE).insert(body)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
