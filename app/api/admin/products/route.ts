import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@ai-whisperers/auth/supabase/admin"

export async function GET(req: NextRequest) {
  const supabase = createAdminClient()
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get("page") || "1")
  const perPage = parseInt(searchParams.get("perPage") || "20")
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  const { data, error, count } = await supabase
    .from("ej_products")
    .select("*", { count: "exact" })
    .order("name")
    .range(from, to)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data: data ?? [], total: count ?? 0, page, perPage })
}

export async function POST(req: NextRequest) {
  const supabase = createAdminClient()
  const body = await req.json()
  const { data, error } = await supabase.from("ej_products").insert(body).select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data?.[0] ?? null)
}

export async function PATCH(req: NextRequest) {
  const supabase = createAdminClient()
  const body = await req.json()
  const { id, ...updates } = body
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

  // Track price/cost changes before updating
  const priceFields = ["price", "cost_price", "price_before"]
  const hasPriceChanges = priceFields.some(f => updates[f] !== undefined)
  let oldValues: Record<string, string> = {}

  if (hasPriceChanges) {
    const { data: current } = await supabase
      .from("ej_products")
      .select("price, cost_price, price_before, name")
      .eq("id", id)
      .single()
    if (current) {
      oldValues = current
      // Log each price field change
      for (const field of priceFields) {
        if (updates[field] !== undefined && String(updates[field]) !== String((current as any)[field])) {
          await supabase.from("ej_price_history").insert({
            product_id: id,
            field,
            old_value: String((current as any)[field] || ""),
            new_value: String((updates as any)[field] || ""),
          }).maybeSingle()
        }
      }
    }
  }

  updates.updated_at = new Date().toISOString()

  const { data, error } = await supabase.from("ej_products").update(updates).eq("id", id).select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Log activity
  if (hasPriceChanges) {
    const changed = priceFields
      .filter(f => updates[f] !== undefined && String(updates[f]) !== String(oldValues[f] || ""))
      .map(f => `${f}: ${oldValues[f] || "—"} → ${updates[f]}`)
    if (changed.length > 0) {
      await supabase.from("ej_activity_log").insert({
        action: "product.price_update",
        entity_type: "product",
        entity_id: String(id),
        summary: `Precio actualizado: ${data?.[0]?.name || "producto #" + id}`,
        details: { changes: changed, old_values: oldValues, new_values: updates },
      }).maybeSingle()
    }
  }

  return NextResponse.json(data?.[0] ?? null)
}

export async function DELETE(req: NextRequest) {
  const supabase = createAdminClient()
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })
  const { error } = await supabase.from("ej_products").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
