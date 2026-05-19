import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { rateLimit } from '@/lib/rate-limit'

export async function middleware(request: NextRequest) {
  const { pathname } = new URL(request.url)

  // Rate limit all admin paths
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const { allowed, response } = rateLimit(request)
    if (!allowed) return response
  }

  // Public paths — no auth needed
  const publicPaths = [
    '/', '/tienda', '/productos', '/producto/', '/nosotros', '/contacto',
    '/faq', '/blog', '/promociones', '/privacidad', '/terminos',
    '/login', '/register', '/recuperar',
    '/sitemap.xml', '/rss.xml', '/robots.txt',
    '/_next/', '/images/', '/favicon',
  ]

  const isPublic = publicPaths.some(p => pathname === p || pathname.startsWith(p))

  // Protected paths — must be authenticated
  const protectedPaths = ['/mi-cuenta', '/admin', '/checkout']

  const isProtected = protectedPaths.some(p => pathname === p || pathname.startsWith(p))

  // Always refresh session cookies
  let supabaseResponse = NextResponse.next({ request })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )
  await supabase.auth.getUser()

  // API admin paths — must be admin
  if (pathname.startsWith('/api/admin')) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()
    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return supabaseResponse
  }

  if (isPublic) return supabaseResponse

  if (isProtected) {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Admin check
    if (pathname.startsWith('/admin')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (!profile || profile.role !== 'admin') {
        return NextResponse.redirect(new URL('/mi-cuenta', request.url))
      }
    }

    return supabaseResponse
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
