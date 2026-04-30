import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { to, subject, html } = await req.json()
    if (!to || !subject || !html) return NextResponse.json({ error: "Missing fields" }, { status: 400 })

    const apiKey = process.env.RESEND_API_KEY
    if (apiKey) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: "El Viajero <noreply@el-viajero.paragu-ai.com>", to, subject, html }),
      })
      const data = await res.json()
      if (!res.ok) return NextResponse.json({ error: data }, { status: 500 })
      return NextResponse.json({ ok: true, id: data.id })
    }

    // Fallback: log to console
    console.log(`[EMAIL] To: ${to} | Subject: ${subject} | Body: ${html.substring(0, 200)}...`)
    return NextResponse.json({ ok: true, note: "Logged to console (no API key configured)" })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
