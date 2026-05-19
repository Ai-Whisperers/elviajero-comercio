import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
// @ts-ignore - sharp has import issues in this TypeScript config
import sharp from "sharp"

/**
 * Batch optimize all existing product images in Supabase.
 * Fetches all product images and optimizes them one by one.
 */
export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  try {
    // 1. Fetch all product images from Supabase
    const { data: products, error: fetchError } = await supabase
      .from("ej_products")
      .select("id, name, image_url")
      .not("image_url", "is", null)

    if (fetchError) {
      return NextResponse.json(
        { error: `Failed to fetch products: ${fetchError.message}` },
        { status: 500 }
      )
    }

    if (!products || products.length === 0) {
      return NextResponse.json(
        { message: "No products found to optimize", optimized: 0 },
        { status: 200 }
      )
    }

    // 2. Process each image
    const results = []
    let successCount = 0
    let failCount = 0

    for (const product of products) {
      const { id, name, image_url } = product

      if (!image_url) {
        console.log(`[batch-optimize] Skipping product ${id} (${name}) - no image`)
        continue
      }

      // Extract filename from URL
      const urlParts = image_url.split('/')
      const filename = urlParts[urlParts.length - 1]

      try {
        // Download image from Supabase
        const { data: fileData, error: downloadError } = await supabase
          .storage
          .from("ej_product_images")
          .download(filename)

        if (downloadError || !fileData) {
          console.error(`[batch-optimize] Failed to download ${filename}:`, downloadError?.message)
          failCount++
          continue
        }

        // Handle both ArrayBuffer and Blob types
        const arrayBuffer = fileData instanceof ArrayBuffer ? fileData : await fileData.arrayBuffer()
        const fileBuffer = Buffer.from(arrayBuffer)

        // Optimize with sharp - resize to max 800px width, convert to WebP, quality 80
        const optimized = await sharp(fileBuffer)
          .resize({ width: 800, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toBuffer()

        // Generate unique filename for optimized version
        const timestamp = Date.now()
        const optimizedFilename = `optimized_${id}_${timestamp}.webp`

        // Upload optimized version
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from("ej_product_images")
          .upload(optimizedFilename, optimized, {
            contentType: "image/webp",
            upsert: true
          })

        if (uploadError || !uploadData) {
          console.error(`[batch-optimize] Failed to upload ${optimizedFilename}:`, uploadError?.message)
          failCount++
          continue
        }

        const optimizedUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${optimizedFilename}`

        results.push({
          productId: id,
          productName: name,
          originalUrl: image_url,
          optimizedUrl,
          status: "success"
        })

        successCount++

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))

      } catch (error) {
        console.error(`[batch-optimize] Error processing product ${id}:`, error)
        failCount++
        results.push({
          productId: id,
          productName: name,
          originalUrl: image_url,
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error"
        })
      }
    }

    const response = {
      total: products.length,
      processed: successCount + failCount,
      success: successCount,
      failed: failCount,
      results
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("[batch-optimize-images] Error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
