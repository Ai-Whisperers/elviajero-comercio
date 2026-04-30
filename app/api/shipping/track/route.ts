
import { NextRequest, NextResponse } from "next/server"

const courierApiKey = process.env.COURIER_API_KEY || ""

export async function POST(req: NextRequest) {
  try {
    const { orderId, carrier, trackingNumber } = await req.json()
    
    if (!courierApiKey) {
      return NextResponse.json({ 
        ok: true, sandbox: true,
        trackingUrl: `https://www.courier.com/track?number=${trackingNumber || orderId}`,
        estimatedDelivery: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0],
        status: "En tránsito",
      })
    }

    return NextResponse.json({ ok: true, trackingUrl: "", estimatedDelivery: "", status: "Pendiente" })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
