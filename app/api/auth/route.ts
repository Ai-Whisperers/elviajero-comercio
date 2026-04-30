import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import crypto from 'crypto'

function hashPassword(p: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  return salt + ':' + crypto.pbkdf2Sync(p, salt, 10000, 64, 'sha512').toString('hex')
}
function verifyPassword(p: string, stored: string): boolean {
  const [salt, hash] = stored.split(':')
  return hash === crypto.pbkdf2Sync(p, salt, 10000, 64, 'sha512').toString('hex')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const db = getDb()
    const { action } = body

    if (action === 'register') {
      const { name, email, password, phone } = body
      if (!name || !email || !password || password.length < 6) return NextResponse.json({ ok: false, error: 'Invalid data' }, { status: 400 })
      if (db.prepare('SELECT id FROM users WHERE email = ?').get(email)) return NextResponse.json({ ok: false, error: 'Email exists' }, { status: 409 })
      const id = crypto.randomUUID()
      db.prepare('INSERT INTO users (id, name, email, password, phone) VALUES (?, ?, ?, ?, ?)').run(id, name, email, hashPassword(password), phone || '')
      return NextResponse.json({ ok: true, user: { id, name, email, phone: phone || '' } })
    }

    if (action === 'login') {
      const { email, password } = body
      const user: any = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
      if (!user || !verifyPassword(password, user.password)) return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 })
      const token = crypto.randomBytes(32).toString('hex')
      db.prepare("INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, datetime('now', '+7 days'))").run(token, user.id)
      return NextResponse.json({ ok: true, token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, createdAt: user.created_at } })
    }

    if (action === 'me') {
      const session: any = db.prepare("SELECT u.id, u.name, u.email, u.phone, u.created_at FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.token = ? AND s.expires_at > datetime('now')").get(body.token)
      if (!session) return NextResponse.json({ ok: false, error: 'Invalid session' }, { status: 401 })
      return NextResponse.json({ ok: true, user: session })
    }

    if (action === 'logout') {
      db.prepare('DELETE FROM sessions WHERE token = ?').run(body.token)
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
