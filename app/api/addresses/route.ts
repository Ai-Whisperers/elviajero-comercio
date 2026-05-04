import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import crypto from "crypto"

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
  const addresses = db.prepare("SELECT id, label, name, street, city, state, zip, phone, is_default as isDefault FROM addresses WHERE user_id = ? ORDER BY is_default DESC, rowid ASC").all(user.id)
  return NextResponse.json(addresses)
}

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "") || ""
  const user = getUserFromToken(token)
  if (!user) return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 })

  try {
    const body = await req.json()
    const { label, name, street, city, state, zip, phone, isDefault } = body
    if (!street || !city) return NextResponse.json({ ok: false, error: "Calle y ciudad son obligatorios" }, { status: 400 })

    const db = getDb()
    const id = crypto.randomUUID()

    if (isDefault) db.prepare("UPDATE addresses SET is_default = 0 WHERE user_id = ?").run(user.id)
    db.prepare("INSERT INTO addresses (id, user_id, label, name, street, city, state, zip, phone, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .run(id, user.id, label || "", name || "", street, city, state || "", zip || "", phone || "", isDefault ? 1 : 0)

    const addr = db.prepare("SELECT id, label, name, street, city, state, zip, phone, is_default as isDefault FROM addresses WHERE id = ?").get(id)
    return NextResponse.json({ ok: true, address: addr })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "") || ""
  const user = getUserFromToken(token)
  if (!user) return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 })

  try {
    const body = await req.json()
    const { id, label, name, street, city, state, zip, phone, isDefault } = body
    if (!id) return NextResponse.json({ ok: false, error: "ID requerido" }, { status: 400 })

    const db = getDb()
    const existing = db.prepare("SELECT id FROM addresses WHERE id = ? AND user_id = ?").get(id, user.id)
    if (!existing) return NextResponse.json({ ok: false, error: "Dirección no encontrada" }, { status: 404 })

    if (isDefault) db.prepare("UPDATE addresses SET is_default = 0 WHERE user_id = ?").run(user.id)
    db.prepare("UPDATE addresses SET label=?, name=?, street=?, city=?, state=?, zip=?, phone=?, is_default=? WHERE id=?")
      .run(label || "", name || "", street || "", city || "", state || "", zip || "", phone || "", isDefault ? 1 : 0, id)

    const addr = db.prepare("SELECT id, label, name, street, city, state, zip, phone, is_default as isDefault FROM addresses WHERE id = ?").get(id)
    return NextResponse.json({ ok: true, address: addr })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "") || ""
  const user = getUserFromToken(token)
  if (!user) return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 })

  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ ok: false, error: "ID requerido" }, { status: 400 })

    const db = getDb()
    db.prepare("DELETE FROM addresses WHERE id = ? AND user_id = ?").run(id, user.id)
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
