import { NextRequest, NextResponse } from "next/server"
import "@/lib/payment/bancard"
import "@/lib/payment/stripe"
import "@/lib/payment/pagopar"
import "@/lib/payment/paypal"
import { getGateway, getRegisteredGateways } from "@/lib/payment"

export async function POST(req: NextRequest, { params }: { params: Promise<{ gateway: string }> }) {
  try {
    const { gateway } = await params
    const adapter = getGateway(gateway)
    if (!adapter) {
      return NextResponse.json({ ok: false, error: `Unknown gateway: ${gateway}. Available: ${getRegisteredGateways().join(", ")}` }, { status: 400 })
    }
    const body = await req.json()
    const result = await adapter.processPayment(body)
    if (!result.ok) return NextResponse.json(result, { status: 500 })
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}

export const dynamic = "force-dynamic"
