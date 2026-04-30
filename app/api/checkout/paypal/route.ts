
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { total, customer } = await req.json()
    const clientId = process.env.PAYPAL_CLIENT_ID
    const secret = process.env.PAYPAL_SECRET

    if (!clientId || !secret) {
      return NextResponse.json({ ok: true, sandbox: true, redirectUrl: "/pedido/confirmado?id=" + Date.now().toString(36) })
    }

    // Get access token
    const auth = Buffer.from(clientId + ":" + secret).toString("base64")
    const tokenRes = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
      method: "POST",
      headers: { "Authorization": "Basic " + auth, "Content-Type": "application/x-www-form-urlencoded" },
      body: "grant_type=client_credentials",
    })
    const tokenData = await tokenRes.json()
    if (!tokenRes.ok) return NextResponse.json({ ok: false, error: tokenData }, { status: 500 })

    // Create order
    const amountUsd = ((total || 0) / 7400).toFixed(2)
    const res = await fetch("https://api-m.paypal.com/v2/checkout/orders", {
      method: "POST",
      headers: { "Authorization": "Bearer " + tokenData.access_token, "Content-Type": "application/json" },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{ amount: { currency_code: "USD", value: amountUsd } }],
        payer: { email_address: customer?.email || "" },
      }),
    })
    const data = await res.json()
    if (!res.ok) return NextResponse.json({ ok: false, error: data }, { status: 500 })

    const approvalUrl = data.links?.find((l: any) => l.rel === "approve")?.href
    return NextResponse.json({ ok: true, url: approvalUrl, redirectUrl: approvalUrl })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
