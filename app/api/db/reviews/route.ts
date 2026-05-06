import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@ai-whisperers/auth/supabase/admin'

export async function GET(req: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(req.url)
    const product = searchParams.get('product')
    let query = supabase.from('ej_reviews').select('*').order('created_at', { ascending: false })
    if (product) query = query.eq('product_name', product)
    const { data } = await query
    return NextResponse.json({ reviews: data || [] })
  } catch (err) { return NextResponse.json({ error: String(err) }, { status: 500 }) }
}

export async function POST(req: NextRequest) {
  try {
    const { review } = await req.json()
    const supabase = createAdminClient()
    await supabase.from('ej_reviews').insert({ product_name: review.productName, user_name: review.userName || 'Anónimo', rating: review.rating, text: review.text || '' })
    return NextResponse.json({ ok: true })
  } catch (err) { return NextResponse.json({ error: String(err) }, { status: 500 }) }
}
