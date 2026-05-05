import { createClient } from '@supabase/supabase-js'
import content from '@/content/es.json'

const c = content as any

// Admin client with service_role key — bypasses RLS
// Only use in API routes, never in client code
export function getAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY not set')
  }
  return createClient(c.supabase.url, serviceKey, {
    auth: { persistSession: false },
    db: { schema: 'public' },
  })
}
