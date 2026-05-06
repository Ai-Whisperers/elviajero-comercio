import { NextRequest, NextResponse } from 'next/server'
import { notifyStatusChange } from '@/lib/whatsapp'
import { createAdminClient } from '@ai-whisperers/auth/supabase/admin'

export async function GET() {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase.from('ej_orders').select('*').order('created_at', { ascending: false })
    return NextResponse.json({ orders: data || [] })
  } catch (err) { return NextResponse.json({ error: String(err) }, { status: 500 }) }
}

export async function POST(req: NextRequest) {
  try {
    const { action, order } = await req.json()
    const supabase = createAdminClient()
    if (action === 'create') {
      await supabase.from('ej_orders').insert({ id: order.id, user_id: order.userId || null, items: JSON.stringify(order.items), total: order.total, address_id: order.addressId || '', payment_method: order.paymentMethod || '', note: order.note || '' })
      return NextResponse.json({ ok: true, id: order.id })
    }
    if (action === 'update_status') {
      await supabase.from('ej_orders').update({ status: order.status }).eq('id', order.id)
      return NextResponse.json({ ok: true })
    }
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (err) { return NextResponse.json({ error: String(err) }, { status: 500 }) }
}
