import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const email = form.get("email")?.toString()
    if (!email) return NextResponse.redirect(new URL("/?subscribe=error", req.url))

    const filePath = path.join(process.cwd(), "data", "subscribers.json")
    let subscribers: string[] = []
    try {
      if (fs.existsSync(filePath)) subscribers = JSON.parse(fs.readFileSync(filePath, "utf-8"))
    } catch {}
    if (!subscribers.includes(email)) subscribers.push(email)
    fs.writeFileSync(filePath, JSON.stringify(subscribers, null, 2))

    return NextResponse.redirect(new URL("/?subscribe=success", req.url))
  } catch {
    return NextResponse.redirect(new URL("/?subscribe=error", req.url))
  }
}
