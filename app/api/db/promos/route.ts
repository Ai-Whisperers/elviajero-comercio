import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const supabase = getAdminClient()
    const { data } = await supabase.from('ej_promo_codes').select('*')
    return NextResponse.json({ promos: data || [] })
  } catch (err) { return NextResponse.json({ error: String(err) }, { status: 500 }) }
}

export async function POST(req: NextRequest) {
  try {
    const { action, promo } = await req.json()
    const supabase = getAdminClient()
    if (action === 'create') {
      await supabase.from('ej_promo_codes').insert({ code: promo.code, type: promo.type, value: promo.value, min_purchase: promo.minPurchase || 0, max_uses: promo.maxUses || 100 })
      return NextResponse.json({ ok: true })
    }
    if (action === 'delete') {
      await supabase.from('ej_promo_codes').delete().eq('code', promo.code)
      return NextResponse.json({ ok: true })
    }
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (err) { return NextResponse.json({ error: String(err) }, { status: 500 }) }
}
