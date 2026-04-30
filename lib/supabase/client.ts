"use client"
import { createClient } from "@supabase/supabase-js"
import content from "@/content/es.json"

const c = content as any
const sb = c.supabase || {}

const supabaseUrl = sb.url || ""
const supabaseAnonKey = sb.anonKey || ""

let supabase: any = null

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}

export { supabase }
