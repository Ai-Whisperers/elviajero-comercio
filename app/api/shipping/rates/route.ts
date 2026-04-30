
import { NextRequest, NextResponse } from "next/server"

const RATES: Record<string, number> = {
  asuncion: 10000, "mariano roque alonso": 12000, lambare: 12000,
  "fernando de la mora": 15000, "san lorenzo": 15000, luque: 15000,
  capiata: 18000, itaugua: 18000, "villa elisa": 15000,
  nemby: 18000, limpio: 18000, "san antonio": 18000,
  "ciudad del este": 25000, encarnacion: 25000, "pedro juan caballero": 30000,
  concepcion: 28000, villarrica: 22000, "coronel oviedo": 20000,
  caacupe: 18000, paraguari: 20000, "san juan bautista": 25000,
  pilar: 28000, filadelfia: 35000, "salto del guaira": 30000,
}

const DEFAULT = 25000

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const city = searchParams.get("city")?.toLowerCase().trim() || ""
  const rate = RATES[city]
  return NextResponse.json({ city, rate, estimatedDays: rate ? (rate <= 12000 ? 1 : rate <= 18000 ? 2 : rate <= 25000 ? 3 : 5) : null })
}

export async function POST(req: NextRequest) {
  try {
    const { from, to, items } = await req.json()
    const city = to?.toLowerCase().trim() || ""
    const rate = RATES[city] || DEFAULT
    const days = rate <= 12000 ? 1 : rate <= 18000 ? 2 : rate <= 25000 ? 3 : 5
    return NextResponse.json({ rate, estimatedDays: days, total: rate * (items?.length || 1), currency: "PYG" })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
