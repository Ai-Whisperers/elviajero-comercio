import { NextRequest, NextResponse } from 'next/server'
import { notifyNewOrder } from '@/lib/whatsapp'

const PYGW = process.env.PYG_PAYMENT_GATEWAY || 'pagopar'

// Create a unified checkout that routes to the right gateway
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { method, order, items, total, customer } = body
    const gateway = method || PYGW

    if (gateway === 'pagopar') {
      return handlePagopar(order, items, total, customer)
    } else if (gateway === 'bancard') {
      return handleBancard(order, total)
    } else if (gateway === 'stripe') {
      return handleStripe(items, total, customer)
    } else if (gateway === 'whatsapp' || gateway === 'transfer') {
      // Manual payment — confirm immediately
      return NextResponse.json({
        ok: true,
        method: gateway,
        message: gateway === 'whatsapp' ? 'Te contactamos por WhatsApp' : 'Instrucciones de transferencia enviadas',
        redirectUrl: `/pedido/confirmado?id=${order?.id || Date.now().toString(36)}`,
      })
    }

    return NextResponse.json({ ok: false, error: 'Método de pago no soportado' }, { status: 400 })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}

async function handlePagopar(order: any, items: any[], total: string, customer: any) {
  const PAGOPAR_API = process.env.PAGOPAR_API_URL || 'https://api.pagopar.com/v1'
  const PAGOPAR_PUBLIC_KEY = process.env.PAGOPAR_PUBLIC_KEY || ''
  const PAGOPAR_PRIVATE_KEY = process.env.PAGOPAR_PRIVATE_KEY || ''
  const orderId = order?.id?.slice(0, 12) || Date.now().toString(36)

  if (!PAGOPAR_PUBLIC_KEY || !PAGOPAR_PRIVATE_KEY) {
    // Fallback to WhatsApp order when not configured
    return NextResponse.json({
      ok: true, sandbox: true, method: 'whatsapp',
      message: 'Te contactamos por WhatsApp para coordinar el pago',
      redirectUrl: `/pedido/confirmado?id=${order?.id || orderId}`,
    })
  }

  const res = await fetch(`${PAGOPAR_API}/pedido`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      public_key: PAGOPAR_PUBLIC_KEY,
      private_key: PAGOPAR_PRIVATE_KEY,
      monto_total: total,
      id_pedido: orderId,
      comprador: { nombre: customer?.name || '', email: customer?.email || '', telefono: customer?.phone || '' },
      items: (items || []).map((i: any) => ({
        cantidad: i.quantity || 1,
        descripcion: i.name || '',
        precio_total: parseFloat(String(i.price || '0').replace(/[^0-9.]/g, '')) || 0,
      })),
    }),
  })

  const data = await res.json()
  if (!res.ok) return NextResponse.json({ ok: false, error: data }, { status: 500 })
  return NextResponse.json({
    ok: true, method: 'pagopar',
    url: data.url || data.redirect_url,
    redirectUrl: data.url || data.redirect_url || `/pedido/confirmado?id=${orderId}`,
  })
}

async function handleBancard(order: any, total: string) {
  const BANCARD_API = process.env.BANCARD_API_URL || 'https://vpos.bancard.com.py/vpos/api/0.3'
  const BANCARD_PUBLIC_KEY = process.env.BANCARD_PUBLIC_KEY || ''
  const BANCARD_PRIVATE_KEY = process.env.BANCARD_PRIVATE_KEY || ''
  const orderId = order?.id?.slice(0, 12) || Date.now().toString(36)

  if (!BANCARD_PUBLIC_KEY || !BANCARD_PRIVATE_KEY) {
    return NextResponse.json({
      ok: true, sandbox: true, method: 'whatsapp',
      message: 'Te contactamos por WhatsApp',
      redirectUrl: `/pedido/confirmado?id=${orderId}`,
    })
  }

  const res = await fetch(`${BANCARD_API}/single_buy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      public_key: BANCARD_PUBLIC_KEY,
      operation: {
        token: orderId,
        shop_process_id: orderId,
        currency: 'PYG',
        amount: total,
        description: `Pedido #${orderId}`,
      },
    }),
  })

  const data = await res.json()
  if (!res.ok) return NextResponse.json({ ok: false, error: data }, { status: 500 })
  return NextResponse.json({
    ok: true, method: 'bancard',
    redirectUrl: data.process_id
      ? `${BANCARD_API}/checkout?process_id=${data.process_id}`
      : `/pedido/confirmado?id=${orderId}`,
  })
}

async function handleStripe(items: any[], total: string, customer: any) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) {
    return NextResponse.json({
      ok: true, sandbox: true, method: 'whatsapp',
      message: 'Te contactamos por WhatsApp',
      redirectUrl: `/pedido/confirmado?id=${Date.now().toString(36)}`,
    })
  }

  // Fetch exchange rate from config
  let rate = 7400
  try {
    const { createAdminClient } = await import("@ai-whisperers/auth/supabase/admin")
    const supabase = createAdminClient()
    const { data } = await supabase.from("ej_site_config").select("value").eq("key", "exchange_rate").single()
    if (data?.value && typeof data.value === "number" && data.value > 0) rate = data.value
  } catch {}

  const amountUsd = Math.round((parseFloat(total.replace(/[^0-9]/g, '')) / rate) * 100)

  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${stripeKey}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://el-viajero.paragu-ai.com'}/pedido/confirmado?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://el-viajero.paragu-ai.com'}/checkout`,
      'line_items[0][price_data][currency]': 'usd',
      'line_items[0][price_data][product_data][name]': 'Pedido El Viajero',
      'line_items[0][price_data][unit_amount]': String(amountUsd),
      'line_items[0][quantity]': '1',
      customer_email: customer?.email || '',
    }).toString(),
  })

  const data = await res.json()
  if (!res.ok) return NextResponse.json({ ok: false, error: data }, { status: 500 })
  return NextResponse.json({ ok: true, method: 'stripe', url: data.url, redirectUrl: data.url })
}
