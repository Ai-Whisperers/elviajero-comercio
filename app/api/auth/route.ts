import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import crypto from 'crypto'

// Simple in-memory rate limiter
const loginAttempts = new Map<string, { count: number; blockUntil: number }>()

function checkLoginRate(email: string, ip: string): { ok: boolean; error?: string } {
  const key = email + ':' + ip
  const now = Date.now()
  const entry = loginAttempts.get(key)
  if (entry && now < entry.blockUntil) {
    return { ok: false, error: 'Demasiados intentos. Intente de nuevo en 5 minutos.' }
  }
  if (entry) {
    entry.count++
    if (entry.count >= 5) {
      entry.blockUntil = now + 300000 // 5 min
      return { ok: false, error: 'Demasiados intentos. Cuenta bloqueada por 5 minutos.' }
    }
  } else {
    loginAttempts.set(key, { count: 1, blockUntil: 0 })
  }
  return { ok: true }
}

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

    if (action === 'login') {
      const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
      const email = body.email || ''
      const rateResult = checkLoginRate(email, ip)
      if (!rateResult.ok) return NextResponse.json({ ok: false, error: rateResult.error }, { status: 429 })

      const user: any = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
      if (!user || !verifyPassword(body.password || '', user.password)) {
        return NextResponse.json({ ok: false, error: 'Credenciales incorrectas' }, { status: 401 })
      }
      const token = crypto.randomBytes(32).toString('hex')
      db.prepare("INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, datetime('now', '+7 days'))").run(token, user.id)
      return NextResponse.json({ ok: true, token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, createdAt: user.created_at } })
    }

    if (action === 'register') {
      const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
      const email = body.email || ''
      const rateResult = checkLoginRate(email, ip)
      if (!rateResult.ok) return NextResponse.json({ ok: false, error: rateResult.error }, { status: 429 })

      const { name, email: mail, password, phone } = body
      if (!name || !mail || !password || password.length < 6) {
        return NextResponse.json({ ok: false, error: 'Datos invalidos' }, { status: 400 })
      }
      if (db.prepare('SELECT id FROM users WHERE email = ?').get(mail)) {
        return NextResponse.json({ ok: false, error: 'Email ya registrado' }, { status: 409 })
      }
      const id = crypto.randomUUID()
      db.prepare('INSERT INTO users (id, name, email, password, phone) VALUES (?, ?, ?, ?, ?)').run(id, name, mail, hashPassword(password), phone || '')
      return NextResponse.json({ ok: true, user: { id, name, email: mail, phone: phone || '' } })
    }

    if (action === 'me') {
      const session: any = db.prepare("SELECT u.id, u.name, u.email, u.phone, u.created_at FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.token = ? AND s.expires_at > datetime('now')").get(body.token)
      if (!session) return NextResponse.json({ ok: false, error: 'Sesion invalida' }, { status: 401 })
      return NextResponse.json({ ok: true, user: session })
    }

    if (action === 'logout') {
      db.prepare('DELETE FROM sessions WHERE token = ?').run(body.token)
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'Accion desconocida' }, { status: 400 })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
