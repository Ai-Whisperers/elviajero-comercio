
import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import crypto from "crypto"

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ""
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || ""

export async function POST(req: NextRequest) {
  try {
    const { credential } = await req.json()
    if (!credential) return NextResponse.json({ ok: false, error: "No credential" }, { status: 400 })

    // Verify Google token
    const res = await fetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + credential)
    if (!res.ok) return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 401 })
    const payload = await res.json()

    const db = getDb()
    const email = payload.email
    const name = payload.name || email.split("@")[0]
    let user: any = db.prepare("SELECT * FROM users WHERE email = ?").get(email)

    if (!user) {
      const id = crypto.randomUUID()
      const randomPass = crypto.randomBytes(16).toString("hex")
      const salt = crypto.randomBytes(16).toString("hex")
      const hash = crypto.pbkdf2Sync(randomPass, salt, 10000, 64, "sha512").toString("hex")
      db.prepare("INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)").run(id, name, email, salt + ":" + hash)
      user = { id, name, email, phone: "", created_at: new Date().toISOString() }
    }

    const token = crypto.randomBytes(32).toString("hex")
    db.prepare("INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, datetime('now', '+7 days'))").run(token, user.id)

    return NextResponse.json({ ok: true, token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone || "", createdAt: user.created_at } })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
