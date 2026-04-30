// Abandoned cart API — sends WhatsApp reminder
import { NextRequest, NextResponse } from "next/server"
import { readFile, writeFile, mkdir } from "fs/promises"
import { join } from "path"

const DATA_DIR = join(process.cwd(), "data")
const CART_FILE = join(DATA_DIR, "abandoned-carts.json")

async function getCarts(): Promise<any[]> {
  try {
    const data = await readFile(CART_FILE, "utf-8")
    return JSON.parse(data)
  } catch { return [] }
}

async function saveCarts(carts: any[]) {
  await mkdir(DATA_DIR, { recursive: true })
  await writeFile(CART_FILE, JSON.stringify(carts, null, 2))
}

export async function POST(request: NextRequest) {
  try {
    const { phone, items, total } = await request.json()
    if (!phone) return NextResponse.json({ error: "Phone required" }, { status: 400 })
    const carts = await getCarts()
    carts.push({
      id: `CART-${Date.now()}`,
      phone, items, total,
      createdAt: new Date().toISOString(),
      remindersSent: 0,
      recovered: false
    })
    await saveCarts(carts)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 })
  }
}

export async function GET() {
  const carts = await getCarts()
  return NextResponse.json(carts)
}
