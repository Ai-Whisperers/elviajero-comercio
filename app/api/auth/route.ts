import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import content from '@/content/es.json'

const c = content as any
const supabaseUrl = c.supabase.url
const supabaseAnonKey = c.supabase.anonKey

// Admin client with service role — can read all profiles
function getAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
    global: serviceKey ? { headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${serviceKey}` } } : {},
  })
}

// SSR client for cookie-based auth
function getSSRClient(req: NextRequest) {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() { return req.cookies.getAll() },
      setAll() {},
    },
  })
}

// Direct client for token-based auth — use service role to verify,
// then switch to anon for profile reads
let _adminSvcClient: ReturnType<typeof createClient> | null = null
function getServiceClient() {
  if (!_adminSvcClient) {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    _adminSvcClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
      global: { headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${serviceKey}` } },
    })
  }
  return _adminSvcClient
}
function getTokenClient(token: string) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  })
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || ''
    const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''

    const body = await req.json()
    const { action } = body

    if (action === 'me') {
      // Try cookie-based auth first
      const ssr = getSSRClient(req)
      const { data: { session } } = await ssr.auth.getSession()

      let user = session?.user

      // Fallback to token-based auth
      if (!user && bearerToken) {
        // Use service role client to verify the JWT (works with any valid Supabase JWT)
        const svc = getServiceClient()
        const { data: tokenUser, error } = await svc.auth.getUser(bearerToken)
        if (!error && tokenUser?.user) {
          user = tokenUser.user
        } else {
          console.error('Token auth error:', error?.message)
        }
      }

      if (!user) {
        return NextResponse.json({ ok: false, error: 'No hay sesión' }, { status: 401 })
      }

      // Use service client to read profile
      const svc = getServiceClient()
      const { data: profile } = await svc.from('profiles').select('*').eq('id', user.id).single()
      return NextResponse.json({
        ok: true,
        user: {
          id: user.id,
          name: profile?.name || user.email?.split('@')[0] || '',
          email: user.email,
          phone: profile?.phone || '',
          role: profile?.role || 'customer',
          createdAt: profile?.created_at || user.created_at,
        },
      })
    }

    if (action === 'login') {
      const supabase = getSSRClient(req)
      const { email, password } = body
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return NextResponse.json({ ok: false, error: 'Credenciales incorrectas' }, { status: 401 })
      return NextResponse.json({
        ok: true,
        session: {
          access_token: data.session?.access_token,
          refresh_token: data.session?.refresh_token,
        }
      })
    }

    if (action === 'register') {
      const supabase = getSSRClient(req)
      const { name, email, password, phone } = body
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { name, phone }, emailRedirectTo: `https://el-viajero.paragu-ai.com/auth/callback` }
      })
      if (error) {
        if (error.message.includes('already registered')) return NextResponse.json({ ok: false, error: 'Email ya registrado' }, { status: 409 })
        return NextResponse.json({ ok: false, error: error.message }, { status: 400 })
      }
      return NextResponse.json({ ok: true })
    }

    if (action === 'logout') {
      const supabase = getSSRClient(req)
      await supabase.auth.signOut()
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'Acción desconocida' }, { status: 400 })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
