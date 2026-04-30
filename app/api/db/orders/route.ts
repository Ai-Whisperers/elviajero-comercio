import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function GET() {
  const db = getDb()
  const orders = db.prepare("SELECT * FROM orders ORDER BY created_at DESC").all()
  return NextResponse.json({ orders })
}

export async function POST(req: NextRequest) {
  try {
    const { action, order } = await req.json()
    const db = getDb()
    if (action === "create") {
      db.prepare("INSERT INTO orders (id, user_id, items, total, status, address_id, payment_method, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").run(
        order.id, order.userId || null, JSON.stringify(order.items), order.total, "pendiente", order.addressId || "", order.paymentMethod || "", order.note || ""
      )
      return NextResponse.json({ ok: true, id: order.id })
    }
    if (action === "update_status") {
      db.prepare("UPDATE orders SET status=? WHERE id=?").run(order.status, order.id)
      return NextResponse.json({ ok: true })
    }
    return NextResponse.json({ error: "Unknown action" }, { status: 400 })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
