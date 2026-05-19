import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@ai-whisperers/auth/supabase/admin"
import { requireAdmin } from "@/lib/auth"

export async function GET(req: NextRequest) {
    const { error: authError } = await requireAdmin(req)
  if (authError) return authError
  const supabase = createAdminClient()
  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get("limit") || "50")
  const entityType = searchParams.get("entity_type") || ""
  const action = searchParams.get("action") || ""

  let query = supabase
    .from("ej_activity_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(Math.min(limit, 200))

  if (entityType) query = query.eq("entity_type", entityType)
  if (action) query = query.eq("action", action)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
    const { error: authError } = await requireAdmin(req)
  if (authError) return authError
  const supabase = createAdminClient()
  const body = await req.json()
  const { action, entity_type, entity_id, summary, details } = body
  if (!action || !entity_type) {
    return NextResponse.json({ error: "action y entity_type requeridos" }, { status: 400 })
  }
  const { data, error } = await supabase.from("ej_activity_log").insert({
    action,
    entity_type,
    entity_id: entity_id || "",
    summary: summary || "",
    details: details || {},
  }).select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data?.[0] ?? null)
}
