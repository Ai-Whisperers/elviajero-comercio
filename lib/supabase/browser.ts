'use client'
import { createBrowserClient } from '@supabase/ssr'
import content from '@/content/es.json'

const c = content as any

export function createClient() {
  return createBrowserClient(c.supabase.url, c.supabase.anonKey)
}
