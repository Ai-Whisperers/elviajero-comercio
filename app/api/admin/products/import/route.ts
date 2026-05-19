import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@ai-whisperers/auth/supabase/admin"
import { requireAdmin } from "@/lib/auth"

export async function POST(req: NextRequest) {
    const { error: authError } = await requireAdmin(req)
  if (authError) return authError
  const supabase = createAdminClient()
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    if (!file) return NextResponse.json({ error: "Archivo requerido" }, { status: 400 })

    const text = await file.text()
    const lines = text.split("\n").filter(l => l.trim())
    if (lines.length < 2) return NextResponse.json({ error: "CSV vacío o solo encabezados" }, { status: 400 })

    // Parse CSV header
    const parseLine = (line: string) => {
      const result: string[] = []
      let current = ""
      let inQuotes = false
      for (let i = 0; i < line.length; i++) {
        const c = line[i]
        if (c === '"') {
          if (inQuotes && line[i + 1] === '"') { current += '"'; i++ }
          else inQuotes = !inQuotes
        } else if (c === "," && !inQuotes) {
          result.push(current.trim())
          current = ""
        } else {
          current += c
        }
      }
      result.push(current.trim())
      return result
    }

    const headers = parseLine(lines[0])
    const rows = lines.slice(1).map(parseLine)

    let created = 0, updated = 0, errors = 0

    for (const row of rows) {
      if (row.length < 2) continue
      const record: Record<string, any> = {}
      headers.forEach((h, i) => {
        record[h] = row[i] || ""
      })

      const name = record.name || ""
      if (!name) { errors++; continue }

      // Clean boolean fields
      if (record.is_new === "true" || record.is_new === "1") record.is_new = true
      else if (record.is_new === "false" || record.is_new === "0" || !record.is_new) record.is_new = false
      if (record.featured === "true" || record.featured === "1") record.featured = true
      else if (record.featured === "false" || record.featured === "0" || !record.featured) record.featured = false

      // Convert stock to number
      record.stock = parseInt(record.stock) || 0

      // Remove id and created_at from updates (auto-generated)
      delete record.id
      delete record.created_at

      // Check if product exists by name or slug
      const { data: existing } = await supabase
        .from("ej_products")
        .select("id, price, cost_price")
        .or(`name.eq.${name},slug.eq.${record.slug || ""}`)
        .maybeSingle()

      if (existing) {
        // Log price changes
        const priceChanges: { field: string; old: string; new: string }[] = []
        if (record.price && record.price !== existing.price) {
          priceChanges.push({ field: "price", old: existing.price, new: record.price })
        }
        if (record.cost_price && record.cost_price !== existing.cost_price) {
          priceChanges.push({ field: "cost_price", old: existing.cost_price, new: record.cost_price })
        }

        const { error: updateErr } = await supabase
          .from("ej_products")
          .update({ ...record, updated_at: new Date().toISOString() })
          .eq("id", existing.id)

        if (updateErr) { errors++; continue }

        // Log price history
        for (const ch of priceChanges) {
          await supabase.from("ej_price_history").insert({
            product_id: existing.id,
            field: ch.field,
            old_value: ch.old,
            new_value: ch.new,
            reason: "Importación CSV",
          }).maybeSingle()
        }

        // Log activity
        await supabase.from("ej_activity_log").insert({
          action: "product.import_update",
          entity_type: "product",
          entity_id: String(existing.id),
          summary: `Actualizado "${name}" por importación CSV`,
          details: { changes: priceChanges },
        }).maybeSingle()

        updated++
      } else {
        const { error: insertErr } = await supabase
          .from("ej_products")
          .insert(record)

        if (insertErr) { errors++; continue }

        // Log activity
        await supabase.from("ej_activity_log").insert({
          action: "product.import_create",
          entity_type: "product",
          entity_id: name,
          summary: `Creado "${name}" por importación CSV`,
        }).maybeSingle()

        created++
      }
    }

    return NextResponse.json({
      ok: true,
      created,
      updated,
      errors,
      total: rows.length,
      message: `${created} creados, ${updated} actualizados, ${errors} errores`,
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
