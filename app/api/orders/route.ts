// Simple order storage API (JSON file, production would use a database)
import { NextResponse } from "next/server"
import { readFile, writeFile, mkdir } from "fs/promises"
import { join } from "path"

const DATA_DIR = join(process.cwd(), "data")
const ORDERS_FILE = join(DATA_DIR, "orders.json")

async function getOrders(): Promise<any[]> {
  try {
    const data = await readFile(ORDERS_FILE, "utf-8")
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function saveOrders(orders: any[]) {
  await mkdir(DATA_DIR, { recursive: true })
  await writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2))
}

export async function GET() {
  const orders = await getOrders()
  return NextResponse.json(orders)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const orders = await getOrders()
    const order = {
      id: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "pending",
      items: body.items || [],
      total: body.total || 0,
      customer: body.customer || {},
      delivery: body.delivery || {},
      payment: body.payment || "whatsapp",
      notes: body.notes || "",
      coupon: body.coupon || null,
      discount: body.discount || 0
    }
    orders.unshift(order)
    await saveOrders(orders)
    return NextResponse.json({ success: true, order })
  } catch (err) {
    return NextResponse.json({ error: "Error creating order" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json()
    const orders = await getOrders()
    const order = orders.find((o: any) => o.id === id)
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 })
    order.status = status
    order.updatedAt = new Date().toISOString()
    await saveOrders(orders)
    return NextResponse.json({ success: true, order })
  } catch {
    return NextResponse.json({ error: "Error updating order" }, { status: 500 })
  }
}
