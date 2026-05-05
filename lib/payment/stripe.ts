import { registerGateway, PaymentRequest } from "./index"

registerGateway({
  name: "stripe",
  processPayment: async ({ total, customer }: PaymentRequest) => {
    const stripeKey = process.env.STRIPE_SECRET_KEY
    if (!stripeKey) {
      return { ok: true, sandbox: true, redirectUrl: `/pedido/confirmado?id=${Date.now().toString(36)}` }
    }

    const amountUsd = Math.round((total / 7400) * 100)

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${stripeKey}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        "mode": "payment",
        "success_url": `${process.env.NEXT_PUBLIC_BASE_URL || ""}/pedido/confirmado?session_id={CHECKOUT_SESSION_ID}`,
        "cancel_url": `${process.env.NEXT_PUBLIC_BASE_URL || ""}/checkout`,
        "line_items[0][price_data][currency]": "usd",
        "line_items[0][price_data][product_data][name]": "Pedido El Viajero",
        "line_items[0][price_data][unit_amount]": String(amountUsd),
        "line_items[0][quantity]": "1",
        "customer_email": customer?.email || "",
      }).toString(),
    })

    const data = await res.json()
    if (!res.ok) return { ok: false, error: data }
    return { ok: true, redirectUrl: data.url, url: data.url }
  },
})
