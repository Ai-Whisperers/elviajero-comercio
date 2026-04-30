import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function GET(req: NextRequest) {
  const db = getDb()
  const { searchParams } = new URL(req.url)
  const product = searchParams.get("product")
  let reviews
  if (product) {
    reviews = db.prepare("SELECT * FROM reviews WHERE product_name = ? ORDER BY created_at DESC").all(product)
  } else {
    reviews = db.prepare("SELECT * FROM reviews ORDER BY created_at DESC").all()
  }
  return NextResponse.json({ reviews })
}

export async function POST(req: NextRequest) {
  try {
    const { review } = await req.json()
    const db = getDb()
    db.prepare("INSERT INTO reviews (id, product_name, user_name, rating, text) VALUES (?, ?, ?, ?, ?)").run(
      review.id, review.productName, review.userName, review.rating, review.text
    )
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
