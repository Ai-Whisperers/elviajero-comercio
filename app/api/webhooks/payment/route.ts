
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, data } = body
    
    console.log("[Webhook] Received:", type, JSON.stringify(data).substring(0, 200))
    
    // Pagopar: payment.confirmed, payment.rejected
    // Bancard: confirmed, rejected
    if (type === "payment.confirmed" || type === "confirmed") {
      const orderId = data.shop_process_id || data.id_pedido
      if (orderId) {
        // Update order status - search across all users
        const users = JSON.parse(localStorage.getItem("viajero_users") || "[]")
        for (const u of users) {
          const ords = JSON.parse(localStorage.getItem("viajero_orders_" + u.id) || "[]")
          const idx = ords.findIndex((o: any) => o.id?.startsWith(orderId) || o.id === orderId)
          if (idx >= 0) {
            ords[idx].status = "confirmado"
            ords[idx].paidAt = new Date().toISOString()
            localStorage.setItem("viajero_orders_" + u.id, JSON.stringify(ords))
            break
          }
        }
      }
    }
    
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[Webhook] Error:", err)
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
