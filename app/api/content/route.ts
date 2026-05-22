import { NextResponse } from "next/server"
import { createAdminClient } from "@ai-whisperers/auth/supabase/admin"
// Public endpoint: returns raw overrides from Supabase only
// All content managed via Supabase ej_site_config table
const SITE_KEY = process.env.NEXT_PUBLIC_SITE_KEY || "elviajero"
const LIVE_KEY = `content_overrides_${SITE_KEY}`

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get("path")

  const supabase = createAdminClient()
  const { data } = await supabase
    .from("ej_site_config")
    .select("value")
    .eq("key", LIVE_KEY)
    .single()

  const overrides = data?.value ?? {}
  const merged = overrides

  if (path) {
    const value = deepGet(merged, path)
    if (value === undefined) {
      return NextResponse.json({ error: `Path '${path}' not found` }, { status: 404 })
    }
    return NextResponse.json({ value })
  }

  return NextResponse.json(merged)
}

function deepMerge(defaults: any, overrides: any): any {
  if (typeof defaults !== "object" || defaults === null) return overrides ?? defaults
  if (typeof overrides !== "object" || overrides === null) return overrides ?? defaults
  if (Array.isArray(defaults) || Array.isArray(overrides)) return overrides ?? defaults

  const result: any = { ...defaults }
  for (const key of Object.keys(overrides)) {
    if (key in defaults) {
      result[key] = deepMerge(defaults[key], overrides[key])
    } else {
      result[key] = overrides[key]
    }
  }
  return result
}

function deepGet(obj: any, path: string): any {
  const parts = path.split(".")
  let cur = obj
  for (const p of parts) {
    if (cur?.[p] === undefined || cur?.[p] === null) return undefined
    cur = cur[p]
  }
  return cur
}
