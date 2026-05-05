import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function POST(req: NextRequest) {
  try {
    // Create a single response that collects Supabase SSR cookies
    const response = NextResponse.json({ ok: false })
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return req.cookies.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // Prepare: read session before body (so getSession doesn't block JSON parse)
    const [{ data: { session } }, body] = await Promise.all([
      supabase.auth.getSession(),
      req.json(),
    ])
    const { action } = body

    if (action === 'me') {
      if (!session) return NextResponse.json({ ok: false, error: 'No hay sesión' }, { status: 401 })
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
      const res = NextResponse.json({
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
      // Copy Supabase auth cookies to the JSON response
      response.cookies.getAll().forEach(c => res.cookies.set(c.name, c.value, c))
      return res
    }

    if (action === 'login') {
      const { email, password } = body
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return NextResponse.json({ ok: false, error: 'Credenciales incorrectas' }, { status: 401 })

      const res = NextResponse.json({ ok: true })
      response.cookies.getAll().forEach(c => res.cookies.set(c.name, c.value, c))
      return res
    }

    if (action === 'register') {
      const { name, email, password, phone } = body
      const { error } = await supabase.auth.signUp({ email, password, options: { data: { name, phone } } })
      if (error) {
        if (error.message.includes('already registered')) return NextResponse.json({ ok: false, error: 'Email ya registrado' }, { status: 409 })
        return NextResponse.json({ ok: false, error: error.message }, { status: 400 })
      }
      const res = NextResponse.json({ ok: true })
      response.cookies.getAll().forEach(c => res.cookies.set(c.name, c.value, c))
      return res
    }

    if (action === 'logout') {
      await supabase.auth.signOut()
      const res = NextResponse.json({ ok: true })
      response.cookies.getAll().forEach(c => res.cookies.set(c.name, c.value, c))
      return res
    }

    return NextResponse.json({ error: 'Acción desconocida' }, { status: 400 })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
