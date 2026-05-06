import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from './supabase/middleware'

export async function middleware(request: NextRequest) {
  const { pathname } = new URL(request.url)

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

  if (isPublic) {
    const res = await updateSession(request)
    return res
  }

  if (isProtected) {
    const supabaseResponse = NextResponse.next()
    const supabase = createMiddlewareClient(request, supabaseResponse)
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

    // Return response with refreshed cookies
    return supabaseResponse
  }

  const res = await updateSession(request)
  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

// Helper: create middleware-aware Supabase client
import { createServerClient } from '@supabase/ssr'

function createMiddlewareClient(req: NextRequest, res: NextResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return req.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          )
        },
      },
    }
  )
}
