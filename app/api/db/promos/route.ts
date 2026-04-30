import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function GET() {
  const db = getDb()
  const promos = db.prepare("SELECT * FROM promo_codes").all()
  return NextResponse.json({ promos })
}

export async function POST(req: NextRequest) {
  try {
    const { action, promo } = await req.json()
    const db = getDb()
    if (action === "create") {
      db.prepare("INSERT INTO promo_codes (code, type, value, min_purchase, max_uses) VALUES (?, ?, ?, ?, ?)").run(
        promo.code, promo.type, promo.value, promo.minPurchase, promo.maxUses
      )
      return NextResponse.json({ ok: true })
    }
    if (action === "delete") {
      db.prepare("DELETE FROM promo_codes WHERE code = ?").run(promo.code)
      return NextResponse.json({ ok: true })
    }
    if (action === "use") {
      db.prepare("UPDATE promo_codes SET used_count = used_count + 1 WHERE code = ?").run(promo.code)
      return NextResponse.json({ ok: true })
    }
    return NextResponse.json({ error: "Unknown action" }, { status: 400 })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
