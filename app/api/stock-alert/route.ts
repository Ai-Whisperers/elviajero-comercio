import { NextRequest, NextResponse } from "next/server"
import { readFile, writeFile, mkdir } from "fs/promises"
import { join } from "path"

const DATA_DIR = join(process.cwd(), "data")
const STOCK_ALERTS_FILE = join(DATA_DIR, "stock-alerts.json")

async function getAlerts(): Promise<any[]> {
  try {
    const data = await readFile(STOCK_ALERTS_FILE, "utf-8")
    return JSON.parse(data)
  } catch { return [] }
}

async function saveAlerts(alerts: any[]) {
  await mkdir(DATA_DIR, { recursive: true })
  await writeFile(STOCK_ALERTS_FILE, JSON.stringify(alerts, null, 2))
}

export async function POST(request: NextRequest) {
  try {
    const { productName, phone } = await request.json()
    if (!productName || !phone) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 })
    }
    const alerts = await getAlerts()
    // Check existing
    const existing = alerts.find((a: any) => a.productName === productName && a.phone === phone)
    if (existing) {
      return NextResponse.json({ message: "Ya estás registrado para este producto" })
    }
    alerts.push({
      id: `ALERT-${Date.now()}`,
      productName,
      phone,
      createdAt: new Date().toISOString(),
      notified: false
    })
    await saveAlerts(alerts)
    return NextResponse.json({ success: true, message: "Te avisaremos cuando vuelva a estar disponible" })
  } catch {
    return NextResponse.json({ error: "Error al registrar alerta" }, { status: 500 })
  }
}

export async function GET() {
  const alerts = await getAlerts()
  return NextResponse.json(alerts)
}
