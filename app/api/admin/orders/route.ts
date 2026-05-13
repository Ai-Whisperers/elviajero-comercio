import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@ai-whisperers/auth/supabase/admin"

const TABLE = "ej_orders"

export async function GET(req: NextRequest) {
  const supabase = createAdminClient()
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (id) {
    const { data, error } = await supabase.from(TABLE).select("*").eq("id", id).single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }
  const { data, error } = await supabase.from(TABLE).select("*").order("created_at", { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
  const supabase = createAdminClient()
  const body = await req.json()
  
  // Save customer contact info to ej_orders for later notifications
  const orderData = {
    id: body.id,
    user_id: body.user_id || null,
    items: body.items || [],
    total: body.total || "0",
    status: body.status || "pendiente",
    address_id: body.address_id || "",
    payment_method: body.payment_method || "whatsapp",
    note: body.note || "",
    customer_name: body.customer_name || body.customer?.name || "",
    customer_phone: body.customer_phone || body.customer?.phone || "",
    customer_email: body.customer_email || body.customer?.email || "",
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
  const supabase = createAdminClient()
  const body = await req.json()
  const { id, ...updates } = body
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

  updates.updated_at = new Date().toISOString()

  const { data, error } = await supabase.from("ej_orders").update(updates).eq("id", id).select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    if (updates.status === "confirmado") {
      const orderItems = data?.[0]?.items || []
      for (const item of orderItems) {
        if (!item.name) continue
        const qty = item.quantity || 1
        const { data: product } = await supabase.from("ej_products").select("id, stock").eq("name", item.name).single()
        if (product) {
          const newStock = Math.max(0, (product.stock || 0) - qty)
          await supabase.from("ej_products").update({ stock: newStock }).eq("id", product.id)
          await supabase.from("ej_stock_movements").insert({
            product_id: product.id,
            product_name: item.name,
            quantity_change: -qty,
            reason: "sale",
            reference_id: `Orden #${((data?.[0]?.id) || "").slice(0, 8)}`,
          }).maybeSingle()
        }
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
        const { sendWhatsApp } = await import("@/lib/whatsapp")
        const carrierLabel = updates.carrier || "transportista"
        await sendWhatsApp(order.customer_phone,
          `📦 *Tu pedido #${id.slice(0, 8)} ya está en camino!*\n\nTransportista: ${carrierLabel}\nTracking: ${updates.tracking_number}\n\nGracias por confiar en El Viajero 🏕️`
        )
      } catch (e) {
        console.error("[whatsapp] Failed to send tracking notification:", e)
      }
    }
  }

  return NextResponse.json(data?.[0] ?? null)
}
