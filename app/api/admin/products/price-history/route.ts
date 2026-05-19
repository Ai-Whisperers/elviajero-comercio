import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@ai-whisperers/auth/supabase/admin"
import { requireAdmin } from "@/lib/auth"

export async function GET(req: NextRequest) {
    const { error: authError } = await requireAdmin(req)
  if (authError) return authError
  const supabase = createAdminClient()
  const { searchParams } = new URL(req.url)
  const productId = searchParams.get("product_id") || ""

  let query = supabase
    .from("ej_price_history")
    .select("*, ej_products!inner(name)")
    .order("created_at", { ascending: false })
    .limit(100)

  if (productId) query = query.eq("product_id", parseInt(productId))

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
    const { error: authError } = await requireAdmin(req)
  if (authError) return authError
  const supabase = createAdminClient()
  const body = await req.json()
  const { product_id, field, old_value, new_value, reason } = body
  if (!product_id || !field) {
    return NextResponse.json({ error: "product_id y field requeridos" }, { status: 400 })
  }
  const { data, error } = await supabase.from("ej_price_history").insert({
    product_id,
    field,
    old_value: old_value || "",
    new_value: new_value || "",
    reason: reason || "",
  }).select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data?.[0] ?? null)
}
