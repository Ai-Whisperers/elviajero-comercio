import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    const body = await req.json()
    const { action } = body

    if (action === 'me') {
      if (!session) return NextResponse.json({ ok: false, error: 'No hay sesión' }, { status: 401 })
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
      return NextResponse.json({
        ok: true,
        user: {
          id: session.user.id,
          name: profile?.name || session.user.email?.split('@')[0] || '',
          email: session.user.email,
          phone: profile?.phone || '',
          role: profile?.role || 'customer',
          createdAt: profile?.created_at || session.user.created_at,
        },
      })
    }

    if (action === 'login') {
      const { email, password } = body
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return NextResponse.json({ ok: false, error: 'Credenciales incorrectas' }, { status: 401 })
      // Force refresh session to ensure cookies are set
      await supabase.auth.getSession()
      return NextResponse.json({ ok: true })
    }

    if (action === 'register') {
      const { name, email, password, phone } = body
      const { error } = await supabase.auth.signUp({ email, password, options: { data: { name, phone } } })
      if (error) {
        if (error.message.includes('already registered')) return NextResponse.json({ ok: false, error: 'Email ya registrado' }, { status: 409 })
        return NextResponse.json({ ok: false, error: error.message }, { status: 400 })
      }
      return NextResponse.json({ ok: true })
    }

    if (action === 'logout') {
      await supabase.auth.signOut()
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'Acción desconocida' }, { status: 400 })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
