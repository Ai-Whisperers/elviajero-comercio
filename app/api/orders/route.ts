import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@ai-whisperers/auth/supabase/admin"

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
    note: body.note || body.internal_notes || "",
    customer_name: body.customer_name || body.customer?.name || "",
    customer_phone: body.customer_phone || body.customer?.phone || "",
    customer_email: body.customer_email || body.customer?.email || "",
  }

  const { data, error } = await supabase.from("ej_orders").insert(orderData).select()
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
      title: "Nuevo pedido",
      body: `Pedido #${(orderData.id || "").slice(0, 8)} — ${orderData.total}`,
      link: `/admin/pedidos/detalle?id=${orderData.id}`,
    })
  } catch (_) { /* non-critical */ }

  return NextResponse.json(data?.[0] ?? null)
}
