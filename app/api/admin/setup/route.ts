import { NextResponse } from "next/server"
import { createAdminClient } from "@ai-whisperers/auth/supabase/admin"

export async function POST() {
  try {
    const supabase = createAdminClient()
    const results: { step: string; ok: boolean; error?: string }[] = []

    // We can't create tables via REST API, but we can verify they exist
    // and provide the SQL for the user to run manually

    // Check if tables exist
    const tables = [
      "ej_products", "ej_orders", "ej_stock_movements",
      "ej_price_history", "ej_activity_log", "ej_notifications"
    ]

    for (const table of tables) {
      const { error } = await supabase.from(table).select("count", { count: "exact", head: true })
      results.push({
        step: `Table ${table}`,
        ok: !error,
        error: error?.message,
      })
    }

    const missing = results.filter(r => !r.ok)

    if (missing.length === 0) {
      // Table exists, just add the new columns if needed
      return NextResponse.json({
        status: "ready",
        message: "Todas las tablas están listas",
        results,
      })
    }

    // If tables don't exist, return the SQL to run
    const fs = require("fs")
    const path = require("path")
    const sqlPath = path.join(process.cwd(), "supabase", "migrations", "003_admin_upgrades.sql")
    const sql = fs.readFileSync(sqlPath, "utf-8")

    return NextResponse.json({
      status: "migration_needed",
      message: "Ejecutá el SQL en Supabase Dashboard > SQL Editor",
      sql_file: "supabase/migrations/003_admin_upgrades.sql",
      tables: results,
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
