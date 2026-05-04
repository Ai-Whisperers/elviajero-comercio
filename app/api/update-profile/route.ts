import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import crypto from "crypto"

function getUserFromToken(token: string): any | null {
  if (!token) return null
  const db = getDb()
  const session: any = db.prepare(
    "SELECT u.id, u.name, u.email, u.phone FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.token = ? AND s.expires_at > datetime('now')"
  ).get(token)
  return session || null
}

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "") || ""
  const user = getUserFromToken(token)
  if (!user) return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 })

  try {
    const { name, phone } = await req.json()
    const db = getDb()
    if (name) db.prepare("UPDATE users SET name = ? WHERE id = ?").run(name, user.id)
    if (phone !== undefined) db.prepare("UPDATE users SET phone = ? WHERE id = ?").run(phone, user.id)
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
