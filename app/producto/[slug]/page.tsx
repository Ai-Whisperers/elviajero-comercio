import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CookieConsent } from "@/components/cookie-consent"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { ShareButtons } from "@/components/share-buttons"
import { Breadcrumbs } from "@/components/ui"
import content from "@/content/es.json"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

const c = content as any
const allProducts = c.home?.productCatalog?.products || []

export async function generateStaticParams() {
  return allProducts.map((p: any) => ({
    slug: p.name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-")
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = allProducts.find((p: any) => 
    p.name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-") === slug
  )
  if (!product) return { title: "Producto no encontrado" }
  return {
    title: `${product.name} - El Viajero | ${product.price}`,
    description: product.description || `Comprá ${product.name} al mejor precio en El Viajero. Envíos a todo Paraguay.`,
    openGraph: { title: `${product.name} - El Viajero`, description: product.description, images: product.imageUrl ? [{ url: product.imageUrl }] : [] }
  }
}

function ProductPage({ product }: { product: any }) {
  const parseGs = (s: string) => parseInt(s.replace(/[^\d]/g, ""), 10) || 0
  const productSlug = product.name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-")

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "brand": { "@type": "Brand", "name": product.brand || "El Viajero" },
    "offers": {
      "@type": "Offer",
      "price": parseGs(product.price),
      "priceCurrency": "PYG",
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "url": `https://el-viajero.paragu-ai.com/producto/${productSlug}`
    },
    "image": product.imageUrl || ""
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />

      <Breadcrumbs items={[
        { label: "Inicio", href: "/" },
        { label: "Tienda", href: "/tienda" },
        { label: product.category || "", href: `/tienda#${(product.category || "").toLowerCase().replace(/[^a-z]/g, "")}` },
        { label: product.name }
      ]} />

      <section className="bg-background py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-10 sm:grid-cols-2">
            {/* Image */}
            <div className="overflow-hidden rounded-2xl border border-border bg-surface p-8 shadow-sm">
              <div className="aspect-square flex items-center justify-center">
                {product.imageUrl ? (
                  <Image src={product.imageUrl} alt={product.name} width={500} height={500} className="h-full w-full object-contain" priority />
                ) : (
                  <div className="text-center text-muted-foreground"><p className="text-sm">Sin imagen disponible</p></div>
                )}
              </div>
            </div>

            {/* Info */}
            <div>
              {product.brand && <p className="text-sm font-semibold text-primary mb-1">{product.brand}</p>}
              <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
              
              {product.isNew && <span className="mt-2 inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">NUEVO</span>}

              <div className="mt-4 flex items-baseline gap-3">
                <p className="text-3xl font-bold text-primary">{product.price}</p>
                {product.priceBefore && <p className="text-lg text-muted-foreground line-through">{product.priceBefore}</p>}
              </div>
              {product.priceBefore && <span className="mt-1 inline-block rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">OFERTA</span>}

              {/* Stock */}
              <div className="mt-4 flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${(product.stock ?? 0) > 0 ? "bg-green-500" : "bg-red-500"}`} />
                <span className="text-sm text-muted-foreground">
                  {(product.stock ?? 0) > 0
                    ? product.stock <= 3 ? `Solo quedan ${product.stock} unidades` : "En stock"
                    : "Producto agotado"}
                </span>
              </div>

              {/* Specs */}
              {product.specs && (
                <div className="mt-6 rounded-xl bg-surface border border-border p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-2">Especificaciones</h3>
                  <p className="text-sm text-muted-foreground">{product.specs}</p>
                  {product.weight && <p className="text-xs text-muted-foreground mt-1">Peso: {product.weight}</p>}
                </div>
              )}

              {/* Description */}
              <p className="mt-6 text-muted-foreground leading-relaxed">{product.description}</p>

              {/* Actions */}
              <div className="mt-8 flex gap-3">
                <AddToCartButton product={product} />
              </div>

              <ShareButtons productName={product.name} productSlug={productSlug} />
            </div>
          </div>
        </div>
      </section>

      {/* Related products */}
      {(() => {
        const related = allProducts.filter((p: any) => p.category === product.category && p.name !== product.name).slice(0, 4)
        if (related.length === 0) return null
        return (
          <section className="bg-surface-light py-16">
            <div className="mx-auto max-w-7xl px-4">
              <h2 className="mb-8 text-2xl font-bold text-foreground">Productos Relacionados</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((p: any, i: number) => {
                  const s = p.name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-")
                  return (
                    <Link key={i} href={`/producto/${s}`} className="overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                      <div className="aspect-[3/2] bg-muted p-4 flex items-center justify-center">
                        {p.imageUrl && <Image src={p.imageUrl} alt={p.name} width={300} height={200} className="h-full w-full object-contain" />}
                      </div>
                      <div className="p-4">
                        <p className="text-sm font-semibold text-foreground line-clamp-1">{p.name}</p>
                        <p className="text-primary font-bold mt-1">{p.price}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        )
      })()}

      <Footer />
      <CookieConsent />
    </>
  )
}

export default async function ProductPageWrapper({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = allProducts.find((p: any) =>
    p.name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-") === slug
  )
  if (!product) notFound()
  return <ProductPage product={product} />
}
