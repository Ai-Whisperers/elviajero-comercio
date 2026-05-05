import { registerGateway, PaymentRequest } from "./index"

const API = process.env.BANCARD_API_URL || "https://vpos.bancard.com.py/vpos/api/0.3"
const PUBLIC_KEY = process.env.BANCARD_PUBLIC_KEY || ""
const PRIVATE_KEY = process.env.BANCARD_PRIVATE_KEY || ""

registerGateway({
  name: "bancard",
  processPayment: async ({ order, total }: PaymentRequest) => {
    const orderId = order.id?.slice(0, 12) || Date.now().toString(36)

    if (!PUBLIC_KEY || !PRIVATE_KEY) {
      return { ok: true, sandbox: true, redirectUrl: `/pedido/confirmado?id=${order.id}` }
    }

    const res = await fetch(`${API}/single_buy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        public_key: PUBLIC_KEY,
        operation: { token: orderId, shop_process_id: orderId, currency: "PYG", amount: total, description: `Pedido #${orderId}` },
      }),
    })
    const data = await res.json()
    if (!res.ok) return { ok: false, error: data }
    return {
      ok: true,
      redirectUrl: data.process_id ? `${API}/checkout?process_id=${data.process_id}` : `/pedido/confirmado?id=${order.id}`,
    }
  },
})
