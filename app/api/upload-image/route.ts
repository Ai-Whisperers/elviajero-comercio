import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@ai-whisperers/auth/supabase/admin"
import { requireAdmin } from "@/lib/auth"

const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
  "image/gif",
  "image/avif",
]
const MAX_SIZE = 5 * 1024 * 1024 // 5MB — matches bucket file_size_limit

export async function POST(req: NextRequest) {
  const { error: authError } = await requireAdmin(req)
  if (authError) return authError
  try {
    const form = await req.formData()
    const file = form.get("file") as File | null
    const path = (form.get("path") as string | null) || "products"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}` },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB (max ${MAX_SIZE / 1024 / 1024}MB)` },
        { status: 400 }
      )
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "png"
    const safeName = `${path}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    const supabase = createAdminClient()
    const { error: uploadError } = await supabase.storage
      .from("ej_images")
      .upload(safeName, file, { contentType: file.type })

    if (uploadError) {
      console.error("[upload-image] Supabase upload error:", uploadError)
      return NextResponse.json(
        { error: uploadError.message || "Upload failed" },
        { status: 500 }
      )
    }

    const { data } = supabase.storage.from("ej_images").getPublicUrl(safeName)
    return NextResponse.json({ url: data.publicUrl })
  } catch (err: any) {
    console.error("[upload-image] Unexpected error:", err)
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    )
  }
}
