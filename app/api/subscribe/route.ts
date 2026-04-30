// Simple newsletter subscription endpoint (stores to local JSON file)
// In production, replace with Mailchimp/SendGrid/ConvertKit API
import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const email = formData.get("email") as string

    if (!email || !email.includes("@") || !email.includes(".")) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 })
    }

    // Store subscription (in production, use an email service)
    const dataDir = join(process.cwd(), "data")
    await mkdir(dataDir, { recursive: true })
    const filePath = join(dataDir, "subscribers.jsonl")
    await writeFile(filePath, JSON.stringify({ email, subscribedAt: new Date().toISOString() }) + "\n", { flag: "a" })

    // Redirect back with success
    return NextResponse.redirect(new URL("/?subscribed=true", request.url), 303)
  } catch {
    return NextResponse.json({ error: "Error al suscribir" }, { status: 500 })
  }
}
