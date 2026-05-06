import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@ai-whisperers/auth/supabase/server'

async function getUser(supabase: any) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null
  return session.user
}

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const user = await getUser(supabase)
  if (!user) return NextResponse.json({ ok: false, error: 'No autorizado' }, { status: 401 })

  const { data } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('is_default', { ascending: false })

  return NextResponse.json((data || []).map((a: any) => ({
    id: a.id, label: a.label || '', name: a.name || '', street: a.street,
    city: a.city, state: a.state || '', zip: a.zip || '', phone: a.phone || '',
    isDefault: a.is_default,
  })))
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const user = await getUser(supabase)
  if (!user) return NextResponse.json({ ok: false, error: 'No autorizado' }, { status: 401 })

  try {
    const body = await req.json()
    const { label, name, street, city, state, zip, phone, isDefault } = body
    if (!street || !city) return NextResponse.json({ ok: false, error: 'Calle y ciudad son obligatorios' }, { status: 400 })

    if (isDefault) await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id)

    const { data, error } = await supabase.from('addresses').insert({
      user_id: user.id, label: label || '', name: name || '', street, city,
      state: state || '', zip: zip || '', phone: phone || '', is_default: isDefault ? true : false,
    }).select().single()

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })

    return NextResponse.json({
      ok: true,
      address: { id: data.id, label: data.label || '', name: data.name || '', street: data.street,
        city: data.city, state: data.state || '', zip: data.zip || '', phone: data.phone || '', isDefault: data.is_default },
    })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const supabase = await createClient()
  const user = await getUser(supabase)
  if (!user) return NextResponse.json({ ok: false, error: 'No autorizado' }, { status: 401 })

  try {
    const body = await req.json()
    const { id, label, name, street, city, state, zip, phone, isDefault } = body
    if (!id) return NextResponse.json({ ok: false, error: 'ID requerido' }, { status: 400 })

    const updates: any = {}
    if (label !== undefined) updates.label = label
    if (name !== undefined) updates.name = name
    if (street !== undefined) updates.street = street
    if (city !== undefined) updates.city = city
    if (state !== undefined) updates.state = state
    if (zip !== undefined) updates.zip = zip
    if (phone !== undefined) updates.phone = phone
    if (isDefault !== undefined) { updates.is_default = isDefault; await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id) }

    const { data, error } = await supabase.from('addresses').update(updates).eq('id', id).eq('user_id', user.id).select().single()
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })

    return NextResponse.json({
      ok: true,
      address: { id: data.id, label: data.label || '', name: data.name || '', street: data.street,
        city: data.city, state: data.state || '', zip: data.zip || '', phone: data.phone || '', isDefault: data.is_default },
    })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient()
  const user = await getUser(supabase)
  if (!user) return NextResponse.json({ ok: false, error: 'No autorizado' }, { status: 401 })

  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ ok: false, error: 'ID requerido' }, { status: 400 })

    await supabase.from('addresses').delete().eq('id', id).eq('user_id', user.id)
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
