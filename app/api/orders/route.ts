import { NextRequest, NextResponse } from 'next/server'
import { notifyStatusChange } from '@/lib/whatsapp'
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
    .from('ej_orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return NextResponse.json((data || []).map((o: any) => ({
    ...o,
    items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items,
    date: o.created_at || o.date,
  })))
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const user = await getUser(supabase)
  if (!user) return NextResponse.json({ ok: false, error: 'No autorizado' }, { status: 401 })

  try {
    const body = await req.json()
    const { items, total, addressId, paymentMethod, note } = body
    if (!items || !items.length) return NextResponse.json({ ok: false, error: 'Carrito vacío' }, { status: 400 })

    const id = 'ORD-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase()
    const { error } = await supabase.from('ej_orders').insert({
      id, user_id: user.id, items: JSON.stringify(items), total: total || '0',
      status: 'pendiente', address_id: addressId || '', payment_method: paymentMethod || '', note: note || '',
    })

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })

    return NextResponse.json({
      ok: true,
      order: { id, items, total, status: 'pendiente', addressId: addressId || '', paymentMethod: paymentMethod || '' },
    })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient()
  const user = await getUser(supabase)
  if (!user) return NextResponse.json({ ok: false, error: 'No autorizado' }, { status: 401 })

  try {
    const body = await req.json()
    const { id, status } = body
    if (!id) return NextResponse.json({ ok: false, error: 'ID requerido' }, { status: 400 })

    await supabase.from('ej_orders').update({ status: status || 'pendiente' }).eq('id', id).eq('user_id', user.id)
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
