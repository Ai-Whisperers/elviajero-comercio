import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Admin client with service role — can read all profiles
function createAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
    global: serviceKey ? { headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${serviceKey}` } } : {},
  })
}

// SSR client for cookie-based auth — requires response object to set cookies
function getSSRClient(req: NextRequest, res: NextResponse) {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() { return req.cookies.getAll() },
      setAll(cookiesToSet: any[]) {
        cookiesToSet.forEach(({ name, value, options }: any) => {
          res.cookies.set(name, value, options)
        })
      }
    },
  })
}

// Direct client for token-based auth — use service role to verify,
// then switch to anon for profile reads
let _adminSvcClient: ReturnType<typeof createClient> | null = null
function getServiceClient() {
  if (!_adminSvcClient) {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    _adminSvcClient = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
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

async function buildAuthUser(user: any) {
  const svc = getServiceClient()
  const { data: profileRow, error: profileError } = await svc
    .from('profiles')
    .select('name,phone,role,created_at')
    .eq('id', user.id)
    .maybeSingle()

  if (profileError) {
    console.error('PROFILE QUERY ERROR:', JSON.stringify({ userId: user.id, error: profileError.message }))
  }

  const profile = (profileRow || {}) as { name?: string; phone?: string; role?: string; created_at?: string }
  return {
    id: user.id,
    name: profile?.name || user.user_metadata?.name || user.email?.split('@')[0] || '',
    email: user.email,
    phone: profile?.phone || user.user_metadata?.phone || '',
    role: profile?.role || 'customer',
    createdAt: profile?.created_at || user.created_at,
  }
}

export async function POST(req: NextRequest) {
  const response = NextResponse.next()
  
  try {
    const authHeader = req.headers.get('authorization') || ''
    const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''

    const body = await req.json()
    const { action } = body

    if (action === 'me') {
      // Try cookie-based auth first
      const ssr = getSSRClient(req, response)
      const { data: { session } } = await ssr.auth.getSession()

      let user = session?.user

      // Fallback to token-based auth — call Supabase REST API directly
      if (!user && bearerToken) {
        try {
          const resp = await fetch(`${supabaseUrl}/auth/v1/user`, {
            headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${bearerToken}` },
          })
          if (resp.ok) {
            const supaUser = await resp.json()
            if (supaUser?.id) user = supaUser
          }
        } catch (e) {
          console.error('Direct token verify error:', e)
        }
      }

      if (!user) {
        return NextResponse.json({ ok: false, error: 'No hay sesión' }, { status: 401 })
      }

      // Use service role to read profile (bypasses RLS)
      return NextResponse.json({
        ok: true,
        user: await buildAuthUser(user),
      })
    }

    if (action === 'login') {
      const cookieResponse = NextResponse.next()
      const supabase = getSSRClient(req, cookieResponse)
      const { email, password } = body
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return NextResponse.json({ ok: false, error: 'Credenciales incorrectas' }, { status: 401 })

      const appUser = await buildAuthUser(data.user)
      const loginResponse = NextResponse.json({
        ok: true,
        user: appUser,
        session: {
          access_token: data.session?.access_token,
          refresh_token: data.session?.refresh_token,
        }
      })
      cookieResponse.cookies.getAll().forEach((cookie) => loginResponse.cookies.set(cookie))
      if (data.session?.access_token) {
        loginResponse.cookies.set('elviajero_admin_token', data.session.access_token, {
          httpOnly: false,
          sameSite: 'lax',
          secure: true,
          path: '/',
          maxAge: 60 * 60,
        })
      }
      return loginResponse
    }

    if (action === 'register') {
      const supabase = getSSRClient(req, response)
      const { name, email, password, phone } = body
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { name, phone },        emailRedirectTo: `https://tiendaelviajero.com.py/auth/callback`}
      })
      if (error) {
        if (error.message.includes('already registered')) return NextResponse.json({ ok: false, error: 'Email ya registrado' }, { status: 409 })
        return NextResponse.json({ ok: false, error: error.message }, { status: 400 })
      }
      return NextResponse.json({ ok: true })
    }

    if (action === 'logout') {
      const supabase = getSSRClient(req, response)
      await supabase.auth.signOut()
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'Acción desconocida' }, { status: 400 })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
