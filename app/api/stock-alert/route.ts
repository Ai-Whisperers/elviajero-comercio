import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { productName, phone } = await request.json()
    if (!productName || !phone) return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })

    const supabase = await createClient()
    // Check existing
    const { data: existing } = await supabase
      .from('stock_alerts')
      .select('*')
      .eq('product_name', productName)
      .eq('phone', phone)
      .single()

    if (existing) return NextResponse.json({ message: 'Ya estás registrado para este producto' })

    await supabase.from('stock_alerts').insert({ product_name: productName, phone, notified: false })
    return NextResponse.json({ success: true, message: 'Te avisaremos cuando vuelva a estar disponible' })
  } catch {
    return NextResponse.json({ error: 'Error al registrar alerta' }, { status: 500 })
  }
}

export async function GET() {
  const supabase = await createClient()
  const { data } = await supabase.from('stock_alerts').select('*').order('created_at', { ascending: false })
  return NextResponse.json(data || [])
}
