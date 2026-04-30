import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function GET() {
  const db = getDb()
  const products = db.prepare("SELECT name as name, category, price, price_before as priceBefore, description, brand, specs, stock, weight, image_url as imageUrl, is_new as isNew, featured FROM products").all()
  return NextResponse.json({ products })
}

export async function POST(req: NextRequest) {
  try {
    const { action, product } = await req.json()
    const db = getDb()
    if (action === "update") {
      db.prepare("UPDATE products SET price=?, stock=?, category=?, price_before=?, description=?, brand=?, specs=?, weight=? WHERE name=?").run(
        product.price, product.stock, product.category, product.priceBefore, product.description, product.brand, product.specs, product.weight, product.name
      )
      return NextResponse.json({ ok: true })
    }
    return NextResponse.json({ error: "Unknown action" }, { status: 400 })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
