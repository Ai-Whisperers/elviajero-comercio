import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import content from '@/content/es.json'

const c = content as any

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    c.supabase.url,
    c.supabase.anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
