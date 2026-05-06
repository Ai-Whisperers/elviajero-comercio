import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@ai-whisperers/auth/supabase/admin'

export async function GET() {
  try {
    const supabase = createAdminClient()
    const { data } = await supabase.from('ej_products').select('*')
    return NextResponse.json({ products: data || [] })
  } catch (err) { return NextResponse.json({ error: String(err) }, { status: 500 }) }
}

export async function POST(req: NextRequest) {
  try {
    const { action, product } = await req.json()
    const supabase = createAdminClient()
    if (action === 'update') {
      await supabase.from('ej_products').update(product).eq('name', product.name)
      return NextResponse.json({ ok: true })
    }
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (err) { return NextResponse.json({ error: String(err) }, { status: 500 }) }
}
