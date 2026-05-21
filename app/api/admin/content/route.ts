import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@ai-whisperers/auth/supabase/admin"
import { requireAdmin } from "@/lib/auth"
import { ContentOverrideSchema } from "@/lib/validation"

// Site-specific key so shared Supabase doesn't leak cross-site data
const SITE_KEY = process.env.NEXT_PUBLIC_SITE_KEY || "elviajero"
const CONFIG_KEY = `content_overrides_${SITE_KEY}`

export async function GET(req: NextRequest) {
  const { error: authError } = await requireAdmin(req)
  if (authError) return authError

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("ej_site_config")
    .select("value")
    .eq("key", CONFIG_KEY)
    .single()

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data?.value ?? {})
}

export async function POST(req: NextRequest) {
  const { error: authError } = await requireAdmin(req)
  if (authError) return authError

  const supabase = createAdminClient()
  const body = await req.json()

  const parsed = ContentOverrideSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((e) => e.message).join(", ") },
      { status: 400 }
    )
  }

  // Upsert: replace entire overrides object for this site
  const { data, error } = await supabase
    .from("ej_site_config")
    .upsert({ key: CONFIG_KEY, value: parsed.data }, { onConflict: "key" })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data?.value ?? {})
}
