import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@ai-whisperers/auth/supabase/admin"
import { requireAdmin } from "@/lib/auth"
import sharp from "sharp"

interface OptimizeImageRequest {
  imageUrl: string
}

interface OptimizeImageResponse {
  original: string
  optimized: string
  error?: string
}

/**
 * Auto-convert uploaded images to WebP format.
 * Downloads from Supabase Storage, optimizes with sharp, re-uploads.
 */
export async function POST(req: NextRequest) {
  try {
    const { error: authError } = await requireAdmin(req)
    if (authError) return authError

    const supabase = createAdminClient()
    const body: OptimizeImageRequest = await req.json()
    const { imageUrl } = body

    if (!imageUrl) {
      return NextResponse.json({ error: "imageUrl required" }, { status: 400 })
    }

    // 1. Extract filename from URL
    // URL format: https://qyvokpribmbrosafntqa.supabase.co/storage/v1/object/public/products/{filename}
    const urlParts = imageUrl.split('/')
    const filename = urlParts[urlParts.length - 1]

    // 2. Download image from Supabase
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from('ej_product_images')
      .download(filename)

    if (downloadError || !fileData) {
      return NextResponse.json(
        { error: `Image not found in storage: ${downloadError?.message || 'Unknown error'}` },
        { status: 404 }
      )
    }

    // Handle both ArrayBuffer and Blob types
    const arrayBuffer = fileData instanceof ArrayBuffer ? fileData : await fileData.arrayBuffer()
    const imageBuffer = Buffer.from(arrayBuffer)

    // 3. Optimize with sharp - resize to max 800px width, convert to WebP, quality 80
    const optimized = await sharp(imageBuffer)
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer()

    // 4. Generate unique filename for optimized version
    const timestamp = Date.now()
    const optimizedFilename = `${timestamp}_optimized.webp`

    // 5. Upload optimized version back to Supabase
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('ej_product_images')
      .upload(optimizedFilename, optimized, {
        contentType: 'image/webp',
        upsert: true
      })

    if (uploadError || !uploadData) {
      return NextResponse.json(
        { error: `Failed to upload optimized image: ${uploadError?.message || 'Unknown error'}` },
        { status: 500 }
      )
    }

    // 6. Return both URLs
    const { data: publicData } = supabase
      .storage
      .from('ej_product_images')
      .getPublicUrl(optimizedFilename)

    const optimizedUrl = publicData.publicUrl

    const response: OptimizeImageResponse = {
      original: imageUrl,
      optimized: optimizedUrl
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('[optimize-image] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
