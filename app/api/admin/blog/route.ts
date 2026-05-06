import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@ai-whisperers/auth/supabase/admin"

// Blog posts stored in ej_site_config under key "blog_posts"
const KEY = "blog_posts"

export async function GET() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("ej_site_config")
    .select("value")
    .eq("key", KEY)
    .single()
  
  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  const posts: any[] = data?.value ?? []
  return NextResponse.json(posts.sort((a: any, b: any) => (b.created_at || "").localeCompare(a.created_at || "")))
}

export async function POST(req: NextRequest) {
  const supabase = createAdminClient()
  const body = await req.json()
  
  // Get existing posts, add new one
  const { data: existing } = await supabase
    .from("ej_site_config")
    .select("value")
    .eq("key", KEY)
    .single()
  
  const posts: any[] = existing?.value ?? []
  
  // Check slug uniqueness
  if (posts.find(p => p.slug === body.slug)) {
    return NextResponse.json({ error: "Ya existe un post con ese slug" }, { status: 400 })
  }
  
  posts.push({
    slug: body.slug,
    title: body.title,
    excerpt: body.excerpt || "",
    content: body.content || "",
    category: body.category || "general",
    image_url: body.image_url || "",
    author: body.author || "",
    published: body.published || false,
    created_at: body.created_at || new Date().toISOString().split("T")[0],
  })
  
  const { error } = await supabase
    .from("ej_site_config")
    .upsert({ key: KEY, value: posts }, { onConflict: "key" })
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function PATCH(req: NextRequest) {
  const supabase = createAdminClient()
  const body = await req.json()
  const slug = body.original_slug || body.slug
  
  const { data: existing } = await supabase
    .from("ej_site_config")
    .select("value")
    .eq("key", KEY)
    .single()
  
  const posts: any[] = existing?.value ?? []
  const idx = posts.findIndex(p => p.slug === slug)
  if (idx === -1) return NextResponse.json({ error: "Post not found" }, { status: 404 })
  
  posts[idx] = { ...posts[idx], ...body }
  
  const { error } = await supabase
    .from("ej_site_config")
    .upsert({ key: KEY, value: posts }, { onConflict: "key" })
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const supabase = createAdminClient()
  const slug = new URL(req.url).searchParams.get("slug")
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 })
  
  const { data: existing } = await supabase
    .from("ej_site_config")
    .select("value")
    .eq("key", KEY)
    .single()
  
  const posts: any[] = existing?.value ?? []
  const filtered = posts.filter(p => p.slug !== slug)
  
  const { error } = await supabase
    .from("ej_site_config")
    .upsert({ key: KEY, value: filtered }, { onConflict: "key" })
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
