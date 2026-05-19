import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@ai-whisperers/auth/supabase/admin"
import { requireAdmin } from "@/lib/auth"

export async function GET(req: NextRequest) {
    const { error: authError } = await requireAdmin(req)
  if (authError) return authError
  const supabase = createAdminClient()
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  // Single profile lookup by id (from auth.users or profiles)
  if (id) {
    const [profileRes, authRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", id).maybeSingle(),
      supabase.auth.admin.getUserById(id),
    ])
    const p: any = profileRes.data || {}
    const au: any = authRes.data?.user || {}
    return NextResponse.json({
      id: p.id || au.id || id,
      name: p.name || au.user_metadata?.name || "",
      phone: p.phone || au.phone || "",
      email: au.email || "",
      role: p.role || "user",
      created_at: p.created_at || au.created_at,
    })
  }

  // List all: merge profiles with auth user emails
  const [profileRes, authRes] = await Promise.all([
    supabase.from("profiles").select("id, name, phone, role, created_at").order("created_at", { ascending: false }),
    supabase.auth.admin.listUsers(),
  ])
  const profiles = profileRes.data ?? []
  const authUsers: any[] = authRes.data?.users ?? []

  const emailMap = new Map(authUsers.map(u => [u.id, u.email || ""]))
  const merged = profiles.map(p => ({ ...p, email: emailMap.get(p.id) || "" }))

  if (profileRes.error) return NextResponse.json({ error: profileRes.error.message }, { status: 500 })
  return NextResponse.json(merged)
}
