"use client"
import { createBrowserClient } from "@supabase/ssr"
import es from "@/content/es.json"

const c = es as any

export function createClient() {
  return createBrowserClient(c.supabase.url, c.supabase.anonKey)
}
export const supabase = createClient()
