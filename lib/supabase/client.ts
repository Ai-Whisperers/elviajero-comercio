"use client"
import { createBrowserClient } from "@supabase/ssr"
const c = require("@/content/es.json")
export function createClient() {
  return createBrowserClient(c.supabase.url, c.supabase.anonKey)
}
export const supabase = createClient()
