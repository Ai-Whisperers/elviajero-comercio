import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@ai-whisperers/auth/supabase/admin"
import { requireAdmin } from "@/lib/auth"

const TABLE = "ej_orders"

export async function GET(req: NextRequest) {
  const { error: authError } = await requireAdmin(req)
  if (authError) return authError
  const supabase = createAdminClient()
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (id) {
    const { data, error } = await supabase.from(TABLE).select("*").eq("id", id).single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }
  const page = parseInt(searchParams.get("page") || "1")
  const perPage = parseInt(searchParams.get("perPage") || "20")
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  const { data, error, count } = await supabase
    .from(TABLE)
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data: data ?? [], total: count ?? 0, page, perPage })
}

export async function POST(req: NextRequest) {
  const supabase = createAdminClient()
  const body = await req.json()

  const orderData = {
    id: body.id,
    user_id: body.user_id || null,
    items: body.items || [],
    total: body.total || "0",
    status: body.status || "pendiente",
    address_id: body.address_id || "",
    payment_method: body.payment_method || "whatsapp",
    customer_name: body.customer_name || body.customer?.name || "",
    customer_phone: body.customer_phone || body.customer?.phone || "",
    customer_email: body.customer_email || body.customer?.email || "",
    payment_status: body.payment_status || "pending",
    payment_proof_url: body.payment_proof_url || "",
    delivery_zone_id: body.delivery_zone_id || "",
    delivery_cost: body.delivery_cost || "0",
    internal_notes: body.note || body.internal_notes || "",
    promo_code: body.promo_code || null,
    discount_applied: body.discount_applied || "0",
  }

  const { data, error } = await supabase.from(TABLE).insert(orderData).select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Notify admin via WhatsApp
  try {
    const { notifyNewOrder } = await import("@/lib/whatsapp")
    await notifyNewOrder(data?.[0] || orderData)
  } catch (e) {
    console.error("[whatsapp] Failed to notify admin:", e)
  }

  // Create in-app notification
  try {
    await supabase.from("ej_notifications").insert({
      type: "order",
      title: "Nuevo pedido (admin)",
      body: `Pedido #${(orderData.id || "").slice(0, 8)} — ${orderData.total}`,
      link: `/admin/pedidos/detalle?id=${orderData.id}`,
    })
  } catch (_) { /* non-critical */ }

  return NextResponse.json(data?.[0] ?? null)
}

export async function PATCH(req: NextRequest) {
  const { error: authError } = await requireAdmin(req)
  if (authError) return authError
  const supabase = createAdminClient()
  const body = await req.json()
  const { id, ...updates } = body
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

  updates.updated_at = new Date().toISOString()

  const { data, error } = await supabase.from(TABLE).update(updates).eq("id", id).select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (updates.status === "confirmado") {
    const orderItems = data?.[0]?.items || []
    for (const item of orderItems) {
      if (!item.id) continue
      const qty = item.quantity || 1
      const { data: product } = await supabase.from("ej_products").select("id, stock").eq("id", item.id).single()
      if (product) {
        const newStock = Math.max(0, (product.stock || 0) - qty)
        await supabase.from("ej_products").update({ stock: newStock }).eq("id", product.id)
        await supabase.from("ej_stock_movements").insert({
          product_id: product.id,
          type: "sale",
          quantity: qty,
          stock_before: product.stock || 0,
          stock_after: newStock,
          reference: `Orden #${((data?.[0]?.id) || "").slice(0, 8)}`,
          note: `Venta confirmada`,
        }).maybeSingle()
      }
    }

    // Decrement promo usage if a promo code was applied
    const orderRecord = data?.[0]
    if (orderRecord?.promo_code) {
      const { data: promo } = await supabase.from("ej_promo_codes").select("code, uses_count").eq("code", orderRecord.promo_code).single()
      if (promo) {
        await supabase.from("ej_promo_codes").update({ uses_count: (promo.uses_count || 0) + 1 }).eq("code", promo.code)
      }
    }

    // Accrue loyalty points
    try {
      const { data: loyaltyData } = await supabase.from("ej_site_config").select("value").eq("key", "loyalty_config").single()
      const loyaltyConfig = loyaltyData?.value || {}
      if (loyaltyConfig.enabled && loyaltyConfig.points_per_gs) {
        const totalNum = parseInt((orderRecord.total || "0").replace(/[^0-9]/g, ""), 10) || 0
        const points = Math.floor(totalNum / (loyaltyConfig.points_per_gs || 1000))
        if (points > 0 && orderRecord.user_id) {
          await supabase.from("ej_loyalty_points").insert({
            user_id: orderRecord.user_id,
            points,
            source: "order",
            source_id: orderRecord.id,
          }).maybeSingle()
        }
      }
    } catch (e) {
      console.error("[loyalty] Failed to accrue points:", e)
    }
  }

  // Log activity for status or tracking changes
  if (updates.status || updates.tracking_number || updates.carrier) {
    const order = data?.[0]
    const changes: string[] = []
    if (updates.status) changes.push(`Estado: ${order?.status}`)
    if (updates.tracking_number) changes.push(`Tracking: ${updates.tracking_number}`)
    if (updates.carrier) changes.push(`Transportista: ${updates.carrier}`)

    await supabase.from("ej_activity_log").insert({
      action: "order.update",
      entity_type: "order",
      entity_id: id,
      summary: `Pedido #${id.slice(0, 8)} actualizado: ${changes.join(", ")}`,
      details: { updates, order_name: order?.customer_name },
    }).maybeSingle()

    // If delivered, set delivered_at
    if (updates.status === "entregado") {
      await supabase.from("ej_orders").update({ delivered_at: new Date().toISOString() }).eq("id", id).maybeSingle()
    }

    // Send notifications
    if (updates.tracking_number && order?.customer_phone) {
      try {
        const { notifyStatusChange } = await import("@/lib/whatsapp")
        await notifyStatusChange(id, order.customer_phone, "enviado", {
          carrier: updates.carrier || "transportista",
          tracking_number: updates.tracking_number,
        })
      } catch (e) {
        console.error("[whatsapp] Failed to send tracking notification:", e)
      }
    }
  }

  // Log payment updates
  if (updates.payment_status || updates.payment_proof_url) {
    await supabase.from("ej_activity_log").insert({
      action: "order.payment_update",
      entity_type: "order",
      entity_id: id,
      summary: `Pago del pedido #${id.slice(0, 8)} actualizado: ${updates.payment_status || ""}`,
      details: { payment_status: updates.payment_status, payment_proof_url: updates.payment_proof_url },
    }).maybeSingle()
  }

  return NextResponse.json(data?.[0] ?? null)
}
