import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const supabase = getAdminClient()
    const { data } = await supabase.from('products').select('*')
    return NextResponse.json({ products: data || [] })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { action, product } = await req.json()
    const supabase = getAdminClient()
    if (action === 'update') {
      const { error } = await supabase.from('products').update(product).eq('name', product.name)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ ok: true })
    }
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
