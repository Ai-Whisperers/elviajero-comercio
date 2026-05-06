import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@ai-whisperers/auth/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('ej_products').select('*')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ products: data || [] })
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient()
  try {
    const { name, updates } = await request.json()
    if (!name || !updates) return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })

    const { data, error } = await supabase.from('ej_products').update(updates).eq('name', name).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, product: data })
  } catch {
    return NextResponse.json({ error: 'Error al actualizar producto' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  try {
    const product = await request.json()
    const { data, error } = await supabase.from('ej_products').insert(product).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, product: data })
  } catch {
    return NextResponse.json({ error: 'Error al crear producto' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  try {
    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
    await supabase.from('ej_products').delete().eq('id', id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error al eliminar producto' }, { status: 500 })
  }
}
