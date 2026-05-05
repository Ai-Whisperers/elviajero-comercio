// Generic CRUD factory for admin API routes
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { authenticateApi, checkRateLimit } from "@/lib/api-auth"

type CrudConfig = {
  table: string
  adminOnly?: boolean
  searchFields?: string[]
  orderField?: string
  orderDir?: "asc" | "desc"
}

export function createCrudRoutes(config: CrudConfig) {
  const { table, adminOnly = true, searchFields = [], orderField = "created_at", orderDir = "desc" } = config

  return {
    // GET — list with optional search
    async GET(req: NextRequest) {
      if (adminOnly) {
        const auth = authenticateApi(req)
        if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: 401 })
      }
      const rl = checkRateLimit(req)
      if (!rl.ok) return NextResponse.json({ error: rl.error }, { status: 429 })

      try {
        const supabase = await createClient()
        const { searchParams } = new URL(req.url)
        const search = searchParams.get("search") || ""
        const page = parseInt(searchParams.get("page") || "1")
        const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100)
        const from = (page - 1) * limit
        const to = from + limit - 1

        let query = supabase.from(table).select("*", { count: "exact" })

        if (search && searchFields.length > 0) {
          const orConditions = searchFields.map((f) => `${f}.ilike.%${search}%`).join(",")
          query = query.or(orConditions)
        }

        const { data, error, count } = await query
          .order(orderField, { ascending: orderDir === "asc" })
          .range(from, to)

        if (error) return NextResponse.json({ error: error.message }, { status: 500 })
        return NextResponse.json({ data, count, page, limit })
      } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 })
      }
    },

    // POST — create
    async POST(req: NextRequest) {
      if (adminOnly) {
        const auth = authenticateApi(req)
        if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: 401 })
      }

      try {
        const supabase = await createClient()
        const body = await req.json()
        const { data, error } = await supabase.from(table).insert(body).select().single()
        if (error) return NextResponse.json({ error: error.message }, { status: 500 })
        return NextResponse.json({ data }, { status: 201 })
      } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 })
      }
    },

    // PUT — update by id
    async PUT(req: NextRequest) {
      if (adminOnly) {
        const auth = authenticateApi(req)
        if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: 401 })
      }

      try {
        const supabase = await createClient()
        const { id, ...updates } = await req.json()
        const { data, error } = await supabase.from(table).update(updates).eq("id", id).select().single()
        if (error) return NextResponse.json({ error: error.message }, { status: 500 })
        return NextResponse.json({ data })
      } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 })
      }
    },

    // DELETE — by id
    async DELETE(req: NextRequest) {
      if (adminOnly) {
        const auth = authenticateApi(req)
        if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: 401 })
      }

      try {
        const supabase = await createClient()
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")
        if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
        const { error } = await supabase.from(table).delete().eq("id", id)
        if (error) return NextResponse.json({ error: error.message }, { status: 500 })
        return NextResponse.json({ ok: true })
      } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 })
      }
    },
  }
}
