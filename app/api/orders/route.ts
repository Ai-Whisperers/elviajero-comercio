import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"

function getUserFromToken(token: string): any | null {
  if (!token) return null
  const db = getDb()
  const session: any = db.prepare(
    "SELECT u.id, u.name, u.email FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.token = ? AND s.expires_at > datetime('now')"
  ).get(token)
  return session || null
}

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "") || ""
  const user = getUserFromToken(token)
  if (!user) return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 })

  const db = getDb()
  const orders = db.prepare("SELECT id, items, total, status, address_id as addressId, payment_method as paymentMethod, note, created_at as createdAt FROM orders WHERE user_id = ? ORDER BY created_at DESC").all(user.id)

  const parsed = orders.map((o: any) => ({
    ...o,
    items: JSON.parse(o.items || "[]")
  }))

  return NextResponse.json(parsed)
}

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "") || ""
  const user = getUserFromToken(token)
  if (!user) return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 })

  try {
    const body = await req.json()
    const { items, total, addressId, paymentMethod, note } = body
    if (!items || !items.length) return NextResponse.json({ ok: false, error: "Carrito vacío" }, { status: 400 })

    const db = getDb()
    const id = "ORD-" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase()
    db.prepare("INSERT INTO orders (id, user_id, items, total, status, address_id, payment_method, note) VALUES (?, ?, ?, ?, 'pendiente', ?, ?, ?)")
      .run(id, user.id, JSON.stringify(items), total || "0", addressId || "", paymentMethod || "whatsapp", note || "")

    const row: any = db.prepare("SELECT id, items, total, status, address_id as addressId, payment_method as paymentMethod, note, created_at as createdAt FROM orders WHERE id = ?").get(id)
    return NextResponse.json({ ok: true, order: { ...row, items: JSON.parse(row?.items || "[]") } })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "") || ""
  const user = getUserFromToken(token)
  if (!user) return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 })

  try {
    const body = await req.json()
    const { id, status } = body
    if (!id) return NextResponse.json({ ok: false, error: "ID requerido" }, { status: 400 })

    const db = getDb()
    const existing = db.prepare("SELECT id FROM orders WHERE id = ? AND user_id = ?").get(id, user.id)
    if (!existing) return NextResponse.json({ ok: false, error: "Pedido no encontrado" }, { status: 404 })

    db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status || "pendiente", id)
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
