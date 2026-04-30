import { NextRequest, NextResponse } from "next/server"

const BANCARD_API = process.env.BANCARD_API_URL || "https://vpos.bancard.com.py/vpos/api/0.3"
const BANCARD_PUBLIC_KEY = process.env.BANCARD_PUBLIC_KEY || ""
const BANCARD_PRIVATE_KEY = process.env.BANCARD_PRIVATE_KEY || ""

export async function POST(req: NextRequest) {
  try {
    const { order, total } = await req.json()
    const orderId = order.id?.slice(0, 12) || Date.now().toString(36)

    if (!BANCARD_PUBLIC_KEY || !BANCARD_PRIVATE_KEY) {
      return NextResponse.json({ ok: true, sandbox: true, redirectUrl: `/pedido/confirmado?id=${order.id}` })
    }

    const res = await fetch(`${BANCARD_API}/single_buy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        public_key: BANCARD_PUBLIC_KEY,
        operation: { token: orderId, shop_process_id: orderId, currency: "PYG", amount: total, description: `Pedido #${orderId}` },
      }),
    })
    const data = await res.json()
    if (!res.ok) return NextResponse.json({ ok: false, error: data }, { status: 500 })
    return NextResponse.json({
      ok: true,
      redirectUrl: data.process_id ? `${BANCARD_API}/checkout?process_id=${data.process_id}` : `/pedido/confirmado?id=${order.id}`,
    })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
