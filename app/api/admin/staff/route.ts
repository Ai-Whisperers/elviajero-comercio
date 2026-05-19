import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@ai-whisperers/auth/supabase/admin"
import { requireAdmin } from "@/lib/auth"
import { StaffRoleSchema } from "@/lib/validation"

export async function GET(req: NextRequest) {
    const { error: authError } = await requireAdmin(req)
  if (authError) return authError
  const supabase = createAdminClient()
  const { data: profiles, error } = await supabase.from("profiles").select("id, name, role, phone, created_at").order("created_at", { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  
  // Get emails from auth users separately
  const { data: users } = await supabase.auth.admin.listUsers()
  const emailMap: Record<string, string> = {}
  if (users) {
    for (const u of users.users) {
      emailMap[u.id] = u.email || ""
    }
  }
  
  const result = (profiles ?? []).map(p => ({
    ...p,
    email: emailMap[p.id] || "",
  }))
  
  return NextResponse.json(result)
}

export async function PATCH(req: NextRequest) {
    const { error: authError } = await requireAdmin(req)
  if (authError) return authError
  const supabase = createAdminClient()
  const body = await req.json()
  const { id, role } = body
  if (!id || !role) return NextResponse.json({ error: "Missing id or role" }, { status: 400 })
  
  const parsed = StaffRoleSchema.safeParse(role)
  if (!parsed.success) {
    return NextResponse.json({ error: `Rol no permitido. Usa uno de: ${StaffRoleSchema.options.join(", ")}` }, { status: 400 })
  }
  
  const { error } = await supabase.from("profiles").update({ role: parsed.data }).eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
