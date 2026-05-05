import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import content from "@/content/es.json"

const c = content as any

export async function GET() {
  const status: any = { ok: true, timestamp: new Date().toISOString(), uptime: process.uptime(), memory: process.memoryUsage() }
  try {
    const supabase = createClient(c.supabase.url, c.supabase.anonKey)
    const { data } = await supabase.from("ej_products").select("id").limit(1)
    status.db = data ? "connected" : "error"
  } catch {
    status.db = "error"
    status.ok = false
  }
  return NextResponse.json(status, { status: status.ok ? 200 : 500 })
}
