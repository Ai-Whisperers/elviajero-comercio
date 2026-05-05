// This file runs as a cron job — checks for:
// 1. Orders delivered > 3 days ago that haven't received a review request
// 2. Abandoned carts > 1 hour that haven't been reminded

import { getAdminClient } from "@/lib/supabase/admin"
import { sendWhatsApp } from "@/lib/whatsapp"

const SITE_URL = "https://el-viajero.paragu-ai.com"

export async function sendReviewRequest(order: any) {
  if (!order.customer_phone || order.customer_phone.length < 8) return false

  const msg = `👋 *El Viajero* 🏕️

¡Gracias por tu compra! 🙌

¿Nos ayudás con una reseña de ${order.items?.[0]?.name || "tu producto"}?

👉 Dejanos tu opinión acá:
${SITE_URL}/reseñas?producto=${encodeURIComponent(order.items?.[0]?.name || "")}&pedido=${order.id?.slice(0, 8)}

Son solo 30 segundos y nos ayuda muchísimo 🙏`

  return sendWhatsApp(order.customer_phone, msg)
}

export async function sendAbandonedCartReminder(cart: any) {
  if (!cart.phone || cart.phone.length < 8) return false

  const reminders = cart.reminders_sent || 0
  
  let msg = ""
  if (reminders === 0) {
    // First reminder — 1 hour after abandonment
    msg = `👋 *El Viajero* 🏕️

¡Te quedaron productos en tu carrito! 😊

📦 Completá tu pedido acá:
${SITE_URL}/tienda

Si tenés alguna duda, respondé este mensaje.`
  } else {
    // Second reminder — 24 hours later, with incentive
    msg = `🎁 *El Viajero* 🏕️

¡No queremos que te pierdas tu pedido! Usá el código *VIAJERO10* y obtené 10% de descuento hoy.

👉 ${SITE_URL}/tienda

Válido por 24 horas ⏰`
  }

  return sendWhatsApp(cart.phone, msg)
}

export async function processReviewRequests() {
  const supabase = getAdminClient()
  const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString()

  // Find orders delivered > 3 days ago that haven't had review request
  const { data: orders } = await supabase
    .from("ej_orders")
    .select("*")
    .eq("status", "entregado")
    .lt("created_at", threeDaysAgo)
    .is("review_requested", null)
    .limit(20)

  if (!orders) return { reviewRequests: 0 }
  
  let sent = 0
  for (const order of orders) {
    const ok = await sendReviewRequest(order)
    if (ok) {
      await supabase.from("ej_orders").update({ review_requested: new Date().toISOString() }).eq("id", order.id)
      sent++
    }
  }

  return { reviewRequests: sent }
}

export async function processAbandonedCarts() {
  const supabase = getAdminClient()
  const oneHourAgo = new Date(Date.now() - 3600000).toISOString()
  const twentyFourHoursAgo = new Date(Date.now() - 86400000).toISOString()

  // First reminder: carts > 1 hour, never reminded
  const { data: firstReminders } = await supabase
    .from("abandoned_carts")
    .select("*")
    .eq("recovered", false)
    .eq("reminders_sent", 0)
    .lt("created_at", oneHourAgo)
    .limit(10)

  // Second reminder: carts > 24 hours, only 1 reminder sent
  const { data: secondReminders } = await supabase
    .from("abandoned_carts")
    .select("*")
    .eq("recovered", false)
    .eq("reminders_sent", 1)
    .lt("created_at", twentyFourHoursAgo)
    .limit(10)

  const allCarts = [...(firstReminders || []), ...(secondReminders || [])]
  let sent = 0

  for (const cart of allCarts) {
    const ok = await sendAbandonedCartReminder(cart)
    if (ok) {
      await supabase
        .from("abandoned_carts")
        .update({ reminders_sent: (cart.reminders_sent || 0) + 1 })
        .eq("id", cart.id)
      sent++
    }
  }

  return { abandonedReminders: sent }
}
