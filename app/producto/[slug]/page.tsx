import { ToastProvider } from "@/components/toast"
import { AuthProvider } from "@ai-whisperers/auth/auth-context"
import ProductContent from "@/components/pages/product-content"
import { createClient } from "@ai-whisperers/auth/supabase/server"
import type { Metadata } from "next"
import content from "@/content/es.json"

const c = content as any
const staticProducts = c.home?.productCatalog?.products || []
const base = "https://el-viajero.paragu-ai.com"

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9áéíóúñü]+/g, "-").replace(/-+$/, "")
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params

  // Try DB first, fall back to static content
  let name = ""
  let description = ""
  let imageUrl = ""
  let price = ""

  try {
    const supabase = await createClient()
    const { data: allData } = await supabase.from("ej_products").select("name, description, image_url, price")
    if (allData) {
      const match = allData.find((p: any) => slugify(p.name) === slug)
      if (match) {
        name = match.name
        description = match.description?.substring(0, 160) || match.name
        imageUrl = match.image_url
        price = match.price
      }
    }
  } catch {}

  if (!name) {
    const staticProd = staticProducts.find((p: any) => slugify(p.name) === slug)
    if (staticProd) {
      name = staticProd.name
      description = (staticProd.description || staticProd.name).substring(0, 160)
      imageUrl = staticProd.imageUrl || ""
      price = staticProd.price
    }
  }

  if (!name) return {}

  const title = `${name} | El Viajero — Camping, Pesca y Aventura en Paraguay`
  const ogImage = imageUrl || "/images/og-viajero.webp"

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${base}/producto/${slug}`,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${base}${ogImage.startsWith("http") ? "" : "/"}${ogImage}`],
    },
    other: {
      "product:price:amount": price,
      "product:price:currency": "PYG",
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return (
    <ToastProvider>
      <AuthProvider>
        <ProductContent slug={slug} />
      </AuthProvider>
    </ToastProvider>
  )
}
