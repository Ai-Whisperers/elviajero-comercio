import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import crypto from "crypto"

function hashPassword(p: string): string {
  const salt = crypto.randomBytes(16).toString("hex")
  return salt + ":" + crypto.pbkdf2Sync(p, salt, 10000, 64, "sha512").toString("hex")
}

function verifyPassword(p: string, stored: string): boolean {
  const [salt, hash] = stored.split(":")
  return hash === crypto.pbkdf2Sync(p, salt, 10000, 64, "sha512").toString("hex")
}

function getUserFromToken(token: string): any | null {
  if (!token) return null
  const db = getDb()
  const session: any = db.prepare(
    "SELECT u.id, u.name, u.email, u.password FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.token = ? AND s.expires_at > datetime('now')"
  ).get(token)
  return session || null
}

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "") || ""
  const user = getUserFromToken(token)
  if (!user) return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 })

  try {
    const { current, newPass } = await req.json()
    if (!current || !newPass) return NextResponse.json({ ok: false, error: "Faltan datos" }, { status: 400 })
    if (newPass.length < 6) return NextResponse.json({ ok: false, error: "Mínimo 6 caracteres" }, { status: 400 })

    if (!verifyPassword(current, user.password)) {
      return NextResponse.json({ ok: false, error: "Contraseña actual incorrecta" }, { status: 400 })
    }

    const db = getDb()
    db.prepare("UPDATE users SET password = ? WHERE id = ?").run(hashPassword(newPass), user.id)
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
