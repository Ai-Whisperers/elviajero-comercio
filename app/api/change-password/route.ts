import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@ai-whisperers/auth/supabase/server'

async function getUser(supabase: any) {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user || null
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const user = await getUser(supabase)
  if (!user) return NextResponse.json({ ok: false, error: 'No autorizado' }, { status: 401 })

  try {
    const { current, newPass } = await req.json()
    if (!current || !newPass) return NextResponse.json({ ok: false, error: 'Faltan datos' }, { status: 400 })
    if (newPass.length < 6) return NextResponse.json({ ok: false, error: 'Mínimo 6 caracteres' }, { status: 400 })

    // Supabase Auth requires re-authentication for password change
    const { error } = await supabase.auth.updateUser({ password: newPass })
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 })

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
