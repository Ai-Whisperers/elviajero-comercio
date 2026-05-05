import { NextRequest, NextResponse } from 'next/server'
import { calculateShipping, SHIPPING_ZONES } from '@/lib/shipping'

export async function POST(req: NextRequest) {
  try {
    const { zoneId, subtotal } = await req.json()
    const result = calculateShipping(zoneId || 'asu', parseInt(subtotal || '0', 10))
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ zones: SHIPPING_ZONES })
}
