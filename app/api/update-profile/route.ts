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
    const { name, phone } = await req.json()
    const updates: any = {}
    if (name) updates.name = name
    if (phone !== undefined) updates.phone = phone

    const { error } = await supabase.from('profiles').update(updates).eq('id', user.id)
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
