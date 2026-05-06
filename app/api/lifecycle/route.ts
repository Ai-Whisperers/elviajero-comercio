import { NextResponse } from "next/server"
import { createAdminClient } from "@ai-whisperers/auth/supabase/admin"
import { sendWhatsApp } from "@/lib/whatsapp"

const SITE_URL = "https://el-viajero.paragu-ai.com"

async function sendReviewRequest(order: any) {
  if (!order.customer_phone || order.customer_phone.length < 8) return false
  const msg = `👋 *El Viajero* 🏕️\n\n¡Gracias por tu compra! 🙌\n\n¿Nos ayudás con una reseña de ${order.items?.[0]?.name || "tu producto"}?\n\n👉 Dejanos tu opinión acá:\n${SITE_URL}/tienda\n\nSon solo 30 segundos 🙏`
  return sendWhatsApp(order.customer_phone, msg)
}

async function sendCartReminder(cart: any) {
  if (!cart.phone || cart.phone.length < 8) return false
  const reminders = cart.reminders_sent || 0
  const msg = reminders === 0
    ? `👋 *El Viajero* 🏕️\n\n¡Te quedaron productos en tu carrito! 😊\n\n📦 Completá tu pedido acá:\n${SITE_URL}/tienda`
    : `🎁 *El Viajero* 🏕️\n\nUsá el código *VIAJERO10* y obtené 10% de descuento hoy.\n\n👉 ${SITE_URL}/tienda\n\nVálido por 24 horas ⏰`
  return sendWhatsApp(cart.phone, msg)
}

export async function GET() {
  const supabase = createAdminClient()
  const results: any = {}

  // 1. Review requests for delivered orders > 3 days
  const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString()
  const { data: reviewable } = await supabase
    .from("ej_orders")
    .select("*")
    .eq("status", "entregado")
    .lt("created_at", threeDaysAgo)
    .limit(10)

  let reviews = 0
  if (reviewable) {
    for (const order of reviewable) {
      const ok = await sendReviewRequest(order)
      if (ok) reviews++
    }
  }
  results.reviewRequests = reviews

  // 2. Abandoned cart reminders
  const oneHourAgo = new Date(Date.now() - 3600000).toISOString()
  const { data: firstReminders } = await supabase
    .from("abandoned_carts")
    .select("*")
    .eq("recovered", false)
    .eq("reminders_sent", 0)
    .lt("created_at", oneHourAgo)
    .limit(10)

  const { data: secondReminders } = await supabase
    .from("abandoned_carts")
    .select("*")
    .eq("recovered", false)
    .eq("reminders_sent", 1)
    .lt("created_at", new Date(Date.now() - 86400000).toISOString())
    .limit(10)

  let carts = 0
  for (const cart of [...(firstReminders || []), ...(secondReminders || [])]) {
    const ok = await sendCartReminder(cart)
    if (ok) {
      await supabase.from("abandoned_carts").update({ reminders_sent: (cart.reminders_sent || 0) + 1 }).eq("id", cart.id)
      carts++
    }
  }
  results.abandonedReminders = carts

  return NextResponse.json(results)
}
