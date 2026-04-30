// Product CRUD API — reads/writes products from content/es.json
import { NextRequest, NextResponse } from "next/server"
import { readFile, writeFile } from "fs/promises"
import { join } from "path"

const CONTENT_FILE = join(process.cwd(), "content", "es.json")

export async function GET() {
  try {
    const data = JSON.parse(await readFile(CONTENT_FILE, "utf-8"))
    return NextResponse.json(data.home?.productCatalog?.products || [])
  } catch {
    return NextResponse.json({ error: "Error reading products" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { name, updates } = await request.json()
    const data = JSON.parse(await readFile(CONTENT_FILE, "utf-8"))
    const products = data.home?.productCatalog?.products || []
    const idx = products.findIndex((p: any) => p.name === name)
    if (idx === -1) return NextResponse.json({ error: "Product not found" }, { status: 404})
    products[idx] = { ...products[idx], ...updates }
    data.home.productCatalog.products = products
    // Sync to productos page
    data.productos.productCatalog.products = products
    await writeFile(CONTENT_FILE, JSON.stringify(data, null, 2))
    return NextResponse.json({ success: true, product: products[idx] })
  } catch {
    return NextResponse.json({ error: "Error updating product" }, { status: 500 })
  }
}
