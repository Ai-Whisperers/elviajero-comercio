
import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function GET() {
  const status: any = { ok: true, timestamp: new Date().toISOString(), uptime: process.uptime(), memory: process.memoryUsage() }
  try {
    getDb().prepare("SELECT 1").get()
    status.db = "connected"
  } catch {
    status.db = "error"
    status.ok = false
  }
  return NextResponse.json(status, { status: status.ok ? 200 : 500 })
}
