import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@ai-whisperers/auth/supabase/admin"
import { requireAdmin } from "@/lib/auth"

const CONFIG_KEY = "scheduled_posts"

export async function GET(req: NextRequest) {
    const { error: authError } = await requireAdmin(req)
  if (authError) return authError
  const supabase = createAdminClient()
  const { searchParams } = new URL(req.url)

  // Cron mode: auto-publish due posts
  if (searchParams.get("publish") === "1") {
    const { data: existing } = await supabase.from("ej_site_config").select("value").eq("key", CONFIG_KEY).single()
    const posts = Array.isArray(existing?.value) ? existing.value : []
    const now = new Date().toISOString()
    let publishedCount = 0
    const publishedIds: string[] = []

    const updated = posts.map((p: any) => {
      if (!p.published && p.scheduled_at && p.scheduled_at <= now) {
        publishedCount++
        publishedIds.push(p.id)
        return { ...p, published: true }
      }
      return p
    })

    if (publishedCount > 0) {
      const { error } = await supabase.from("ej_site_config").upsert({ key: CONFIG_KEY, value: updated }, { onConflict: "key" })
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, published: publishedCount, ids: publishedIds })
  }

  const { data } = await supabase.from("ej_site_config").select("value").eq("key", CONFIG_KEY).single()
  return NextResponse.json(data?.value ?? [])
}

export async function POST(req: NextRequest) {
    const { error: authError } = await requireAdmin(req)
  if (authError) return authError
  const supabase = createAdminClient()
  const body = await req.json()

  const { data: existing } = await supabase.from("ej_site_config").select("value").eq("key", CONFIG_KEY).single()
  let posts = Array.isArray(existing?.value) ? existing.value : []

  const idx = posts.findIndex((p: any) => p.id === body.id)
  if (idx >= 0) {
    posts[idx] = { ...posts[idx], ...body }
  } else {
    posts.push(body)
  }

  const { error } = await supabase.from("ej_site_config").upsert({ key: CONFIG_KEY, value: posts }, { onConflict: "key" })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function PATCH(req: NextRequest) {
    const { error: authError } = await requireAdmin(req)
  if (authError) return authError
  const supabase = createAdminClient()
  const body = await req.json()
  const { id, ...updates } = body

  const { data: existing } = await supabase.from("ej_site_config").select("value").eq("key", CONFIG_KEY).single()
  let posts = Array.isArray(existing?.value) ? existing.value : []

  const idx = posts.findIndex((p: any) => p.id === id)
  if (idx < 0) return NextResponse.json({ error: "Post not found" }, { status: 404 })

  posts[idx] = { ...posts[idx], ...updates }

  const { error } = await supabase.from("ej_site_config").upsert({ key: CONFIG_KEY, value: posts }, { onConflict: "key" })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, post: posts[idx] })
}

export async function DELETE(req: NextRequest) {
    const { error: authError } = await requireAdmin(req)
  if (authError) return authError
  const supabase = createAdminClient()
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  const { data: existing } = await supabase.from("ej_site_config").select("value").eq("key", CONFIG_KEY).single()
  const posts = (Array.isArray(existing?.value) ? existing.value : []).filter((p: any) => p.id !== id)

  const { error } = await supabase.from("ej_site_config").upsert({ key: CONFIG_KEY, value: posts }, { onConflict: "key" })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
