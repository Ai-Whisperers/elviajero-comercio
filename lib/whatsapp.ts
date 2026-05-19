const EVOLUTION_URL = process.env.EVOLUTION_API_URL || ''
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || ''
const EVOLUTION_INSTANCE = process.env.EVOLUTION_INSTANCE || ''
const ADMIN_NUMBER = process.env.ADMIN_WHATSAPP || ''

function cleanNumber(number: string): string {
  return number.replace(/[^0-9]/g, '')
}

export async function sendWhatsApp(to: string, message: string): Promise<boolean> {
  const number = cleanNumber(to)
  try {
    const res = await fetch(
      `${EVOLUTION_URL}/message/sendText/${EVOLUTION_INSTANCE}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': EVOLUTION_API_KEY,
        },
        body: JSON.stringify({
          number,
          text: message,
          delay: 1000,
        }),
      }
    )
    if (!res.ok) {
      const text = await res.text()
      console.error('[WhatsApp] Send failed:', text.substring(0, 300))
      return false
    }
    return true
  } catch (err) {
    console.error('[WhatsApp] Error:', err)
    return false
  }
}

export async function sendMedia(to: string, caption: string, mediaUrl: string, mediaType: string = 'image'): Promise<boolean> {
  const number = cleanNumber(to)
  try {
    const res = await fetch(
      `${EVOLUTION_URL}/message/sendMedia/${EVOLUTION_INSTANCE}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': EVOLUTION_API_KEY,
        },
        body: JSON.stringify({
          number,
          mediatype: mediaType,
          media: mediaUrl,
          caption,
          delay: 1000,
        }),
      }
    )
    if (!res.ok) {
      const text = await res.text()
      console.error('[WhatsApp] Send media failed:', text.substring(0, 300))
      return false
    }
    return true
  } catch (err) {
    console.error('[WhatsApp] Media error:', err)
    return false
  }
}

// Load templates from ej_site_config
async function loadTemplates(): Promise<any[]> {
  try {
    const { createAdminClient } = await import("@ai-whisperers/auth/supabase/admin")
    const supabase = createAdminClient()
    const { data } = await supabase.from("ej_site_config").select("value").eq("key", "whatsapp_templates").single()
    const list = data?.value || []
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

function renderTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? `{${key}}`)
}

export async function notifyNewOrder(order: any) {
  const templates = await loadTemplates()
  const tpl = templates.find((t: any) => t.trigger === "order_new" && t.active)
  const vars = {
    order_id: order.id?.slice(0, 8) || "",
    customer_name: order.customer_name || "",
    total: order.total || "",
    admin_url: "https://el-viajero.paragu-ai.com/admin/pedidos",
  }
  const msg = tpl ? renderTemplate(tpl.message, vars)
    : `🆕 *Nuevo pedido* #${order.id?.slice(0, 8)}\nTotal: ${order.total}\nPago: ${order.payment_method || 'whatsapp'}\n\nVer en el panel:\nhttps://el-viajero.paragu-ai.com/admin/pedidos`
  await sendWhatsApp(ADMIN_NUMBER, msg)
}

export async function notifyStatusChange(orderId: string, customerPhone: string, newStatus: string, extra: { carrier?: string; tracking_number?: string } = {}) {
  const templates = await loadTemplates()
  const triggerMap: Record<string, string> = {
    confirmado: "order_confirmed",
    enviado: "order_shipped",
    entregado: "order_delivered",
    cancelado: "order_cancelled",
  }
  const tpl = templates.find((t: any) => t.trigger === triggerMap[newStatus] && t.active)
  const vars: Record<string, string> = {
    order_id: orderId?.slice(0, 8) || "",
    customer_name: "",
    tracking_number: extra.tracking_number || "",
    carrier: extra.carrier || "",
    review_url: "https://el-viajero.paragu-ai.com",
  }

  let msg: string
  if (tpl) {
    msg = renderTemplate(tpl.message, vars)
  } else {
    const statusLabels: Record<string, string> = {
      confirmado: '✅ Tu pedido fue confirmado',
      enviado: '🚚 Tu pedido fue enviado',
      entregado: '📦 Tu pedido fue entregado',
      cancelado: '❌ Tu pedido fue cancelado',
    }
    msg = `👋 *El Viajero*\n\n${statusLabels[newStatus] || '📋 Estado actualizado: ' + newStatus}\nPedido: #${orderId?.slice(0, 8)}\n\nAnte cualquier duda, respondé este mensaje.`
  }

  if (customerPhone && customerPhone.length > 8) {
    await sendWhatsApp(customerPhone, msg)
  }
}

