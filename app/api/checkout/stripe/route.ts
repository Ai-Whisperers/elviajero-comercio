
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { items, total, customer } = await req.json()
    
    const stripeKey = process.env.STRIPE_SECRET_KEY
    if (!stripeKey) {
      return NextResponse.json({ ok: true, sandbox: true, redirectUrl: "/pedido/confirmado?id=" + Date.now().toString(36) })
    }

    // Convert PYG to USD (approximately)
    const amountUsd = Math.round((total / 7400) * 100) // cents

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + stripeKey,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        "mode": "payment",
        "success_url": process.env.NEXT_PUBLIC_BASE_URL + "/pedido/confirmado?session_id={CHECKOUT_SESSION_ID}",
        "cancel_url": process.env.NEXT_PUBLIC_BASE_URL + "/checkout",
        "line_items[0][price_data][currency]": "usd",
        "line_items[0][price_data][product_data][name]": "Pedido El Viajero",
        "line_items[0][price_data][unit_amount]": String(amountUsd),
        "line_items[0][quantity]": "1",
        "customer_email": customer?.email || "",
      }).toString(),
    })

    const data = await res.json()
    if (!res.ok) return NextResponse.json({ ok: false, error: data }, { status: 500 })
    return NextResponse.json({ ok: true, url: data.url, redirectUrl: data.url })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
