import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@ai-whisperers/auth/supabase/admin"
import { requireAdmin } from "@/lib/auth"

const ALLOWED_PRODUCT_FIELDS = new Set([
  "name","category","price","price_before","description","brand","specs",
  "stock","weight","image_url","is_new","featured","cost_price","stock_alert_threshold"
])

function sanitizeProductBody(body: Record<string, any>) {
  const clean: Record<string, any> = {}
  for (const [k, v] of Object.entries(body)) {
    if (ALLOWED_PRODUCT_FIELDS.has(k)) clean[k] = v
  }
  return clean
}

export async function GET(req: NextRequest) {
  const { error: authError } = await requireAdmin(req)
  if (authError) return authError
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
  const { error: authError } = await requireAdmin(req)
  if (authError) return authError
  const supabase = createAdminClient()
  const body = await req.json()
  const clean = sanitizeProductBody(body)
  const { data, error } = await supabase.from("ej_products").insert(clean).select()
  if (error) return NextResponse.json({ error: error.message, code: error.code }, { status: 500 })
  return NextResponse.json(data?.[0] ?? null)
}

export async function PATCH(req: NextRequest) {
  const { error: authError } = await requireAdmin(req)
  if (authError) return authError
  const debug: any = { step: "init", ts: new Date().toISOString() }
  try {
    const supabase = createAdminClient()
    const body = await req.json()
    debug.requestBody = body
    const { id, ...updates } = body
    if (!id) {
      debug.step = "missing-id"
      return NextResponse.json({ error: "id required", debug }, { status: 400 })
    }
    debug.step = "parsed"
    debug.id = id

    const cleanUpdates = sanitizeProductBody(updates)
    debug.cleanUpdates = cleanUpdates

    const priceFields = ["price", "cost_price", "price_before"]
    const hasPriceChanges = priceFields.some(f => cleanUpdates[f] !== undefined)
    debug.hasPriceChanges = hasPriceChanges
    let oldValues: Record<string, any> = {}

    if (hasPriceChanges) {
      debug.step = "fetch-current"
      const { data: current, error: fetchErr } = await supabase
        .from("ej_products")
        .select("price, cost_price, price_before, name")
        .eq("id", id)
        .single()
      debug.fetchResult = { current, fetchErr }
      if (fetchErr) {
        debug.step = "fetch-error"
        return NextResponse.json({ error: fetchErr.message, debug }, { status: 500 })
      }
      if (current) {
        oldValues = current
        debug.oldValues = oldValues
        for (const field of priceFields) {
          const oldVal = (current as any)[field]
          const newVal = cleanUpdates[field]
          debug.step = `compare-${field}`
          debug.compare = { field, oldVal, newVal, oldStr: String(oldVal), newStr: String(newVal), changed: newVal !== undefined && String(newVal) !== String(oldVal) }
          if (newVal !== undefined && String(newVal) !== String(oldVal)) {
            debug.step = `insert-price_history-${field}`
            const insertPayload = {
              product_id: id,
              field,
              old_value: String(oldVal || ""),
              new_value: String(newVal || ""),
            }
            debug.insertPayload = insertPayload
            const { data: histData, error: histErr } = await supabase.from("ej_price_history").insert(insertPayload).select()
            debug.priceHistoryResult = { histData, histErr }
            if (histErr) {
              debug.step = `price_history-error-${field}`
              return NextResponse.json({ error: histErr.message, code: histErr.code, hint: histErr.hint, details: histErr.details, debug }, { status: 500 })
            }
          }
        }
      }
    }

    cleanUpdates.updated_at = new Date().toISOString()
    debug.step = "update-product"
    debug.updatePayload = cleanUpdates
    const { data, error } = await supabase.from("ej_products").update(cleanUpdates).eq("id", id).select()
    debug.updateResult = { data, error }
    if (error) {
      debug.step = "update-error"
      return NextResponse.json({ error: error.message, code: error.code, hint: error.hint, details: error.details, debug }, { status: 500 })
    }

    if (hasPriceChanges) {
      const changed = priceFields
        .filter(f => cleanUpdates[f] !== undefined && String(cleanUpdates[f]) !== String(oldValues[f] || ""))
        .map(f => `${f}: ${oldValues[f] || "—"} → ${cleanUpdates[f]}`)
      debug.changedFields = changed
      if (changed.length > 0) {
        debug.step = "insert-activity_log"
        const actPayload = {
          action: "product.price_update",
          entity_type: "product",
          entity_id: String(id),
          summary: `Precio actualizado: ${data?.[0]?.name || "producto #" + id}`,
          details: { changes: changed, old_values: oldValues, new_values: cleanUpdates },
        }
        debug.activityPayload = actPayload
        const { data: actData, error: actErr } = await supabase.from("ej_activity_log").insert(actPayload).select()
        debug.activityResult = { actData, actErr }
        if (actErr) {
          debug.step = "activity_log-error"
          return NextResponse.json({ error: actErr.message, code: actErr.code, hint: actErr.hint, details: actErr.details, debug }, { status: 500 })
        }
      }
    }

    debug.step = "done"
    return NextResponse.json({ data: data?.[0] ?? null })
  } catch (err: any) {
    debug.step = "uncaught-exception"
    debug.errorName = err?.name
    debug.errorMessage = err?.message
    debug.errorStack = err?.stack
    debug.errorCode = err?.code
    console.error("[PATCH /api/admin/products] uncaught error:", err)
    return NextResponse.json({ error: err?.message || "Internal server error", debug }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const { error: authError } = await requireAdmin(req)
  if (authError) return authError
  const supabase = createAdminClient()
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })
  const { error } = await supabase.from("ej_products").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
