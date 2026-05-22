import { NextResponse } from "next/server"
import { createAdminClient } from "@ai-whisperers/auth/supabase/admin"

export async function GET() {
  const supabase = createAdminClient()
  const SITE_KEY = process.env.NEXT_PUBLIC_SITE_KEY || "elviajero"
  const LIVE_KEY = `content_overrides_${SITE_KEY}`

  const { data, error } = await supabase
    .from("ej_site_config")
    .select("key, value")
    .limit(5)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    SITE_KEY,
    LIVE_KEY,
    rows: data?.map((r: any) => ({
      key: r.key,
      valueType: typeof r.value,
      valueKeys: r.value && typeof r.value === "object" ? Object.keys(r.value) : null,
      hasProductCatalog: r.value && typeof r.value === "object" ? "productCatalog" in r.value : false,
    })),
  })
}