import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function GET() {
  const db = getDb()
  const users = db.prepare("SELECT id, name, email, phone, created_at FROM users ORDER BY created_at DESC").all()
  return NextResponse.json({ users })
}

export async function POST(req: NextRequest) {
  try {
    const { action, ...data } = await req.json()
    const db = getDb()

    if (action === "register") {
      const exists = db.prepare("SELECT id FROM users WHERE email = ?").get(data.email)
      if (exists) return NextResponse.json({ ok: false, error: "Email ya registrado" }, { status: 400 })
      db.prepare("INSERT INTO users (id, name, email, password, phone) VALUES (?, ?, ?, ?, ?)").run(data.id, data.name, data.email, data.password, data.phone || "")
      return NextResponse.json({ ok: true })
    }

    if (action === "login") {
      const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(data.email, data.password)
      if (!user) return NextResponse.json({ ok: false, error: "Credenciales incorrectas" }, { status: 401 })
      const { password, ...safe } = user as any
      return NextResponse.json({ ok: true, user: safe })
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
