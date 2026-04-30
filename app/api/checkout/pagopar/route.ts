import { NextRequest, NextResponse } from "next/server"

const PAGOPAR_API = process.env.PAGOPAR_API_URL || "https://api.pagopar.com/v1"
const PAGOPAR_PUBLIC_KEY = process.env.PAGOPAR_PUBLIC_KEY || ""
const PAGOPAR_PRIVATE_KEY = process.env.PAGOPAR_PRIVATE_KEY || ""

export async function POST(req: NextRequest) {
  try {
    const { order, items, total, customer } = await req.json()
    const orderId = order.id?.slice(0, 12) || Date.now().toString(36)

    if (!PAGOPAR_PUBLIC_KEY || !PAGOPAR_PRIVATE_KEY) {
      return NextResponse.json({ ok: true, sandbox: true, redirectUrl: `/pedido/confirmado?id=${order.id}` })
    }

    const res = await fetch(`${PAGOPAR_API}/pedido`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        public_key: PAGOPAR_PUBLIC_KEY,
        private_key: PAGOPAR_PRIVATE_KEY,
        monto_total: total,
        id_pedido: orderId,
        comprador: { nombre: customer.name, email: customer.email, telefono: customer.phone },
        items: items.map((i: any) => ({ cantidad: i.quantity, descripcion: i.name, precio_total: i.priceGs })),
      }),
    })
    const data = await res.json()
    if (!res.ok) return NextResponse.json({ ok: false, error: data }, { status: 500 })
    return NextResponse.json({ ok: true, url: data.url || data.redirect_url, redirectUrl: data.url || data.redirect_url })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
