import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { phone, items, total } = await request.json()
    if (!phone) return NextResponse.json({ error: 'Phone required' }, { status: 400 })

    const supabase = await createClient()
    const { error } = await supabase.from('abandoned_carts').insert({
      phone, items: JSON.stringify(items || []), total: total || '0',
      reminders_sent: 0, recovered: false,
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function GET() {
  const supabase = await createClient()
  const { data } = await supabase.from('abandoned_carts').select('*').order('created_at', { ascending: false })
  return NextResponse.json(data || [])
}
