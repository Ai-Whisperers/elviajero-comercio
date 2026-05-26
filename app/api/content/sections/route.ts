// app/api/content/sections/route.ts — Phase 2: CRUD for content sections
import { NextResponse } from "next/server"
import { createAdminClient } from "@ai-whisperers/auth/supabase/admin"

// GET /api/content/sections?key=navbar — get one or all sections
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const key = searchParams.get("key")

  const supabase = createAdminClient()

  if (key) {
    const { data, error } = await supabase
      .from("ej_content_sections")
      .select("*")
      .eq("section_key", key)
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 404 })
    return NextResponse.json({ section: data })
  }

  const { data, error } = await supabase
    .from("ej_content_sections")
    .select("*")
    .order("section_key")

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ sections: data })
}

// POST /api/content/sections — create section
export async function POST(request: Request) {
  const supabase = createAdminClient()
  const body = await request.json()
  const { section_key, content, is_published } = body

  if (!section_key || !content) {
    return NextResponse.json({ error: "section_key and content required" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("ej_content_sections")
    .insert({ section_key, content, is_published: is_published ?? false })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ section: data }, { status: 201 })
}

// PATCH /api/content/sections?key=navbar — update section
export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url)
  const key = searchParams.get("key")

  if (!key) return NextResponse.json({ error: "key query param required" }, { status: 400 })

  const supabase = createAdminClient()
  const body = await request.json()

  const { data, error } = await supabase
    .from("ej_content_sections")
    .update({ content: body.content, is_published: body.is_published, updated_at: new Date().toISOString() })
    .eq("section_key", key)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ section: data })
}

// DELETE /api/content/sections?key=navbar
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const key = searchParams.get("key")

  if (!key) return NextResponse.json({ error: "key query param required" }, { status: 400 })

  const supabase = createAdminClient()
  const { error } = await supabase.from("ej_content_sections").delete().eq("section_key", key)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}