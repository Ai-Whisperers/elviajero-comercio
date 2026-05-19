"use client"

import { useCart } from "@ai-whisperers/commerce/cart/cart-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartSidebar } from "@/components/cart-sidebar"
import { CookieConsent } from "@/components/cookie-consent"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { CartToastListener } from "@/components/cart-toast-listener"
import { BackInStockForm } from "@/components/back-in-stock"
import { ProductReviews } from "@/components/product-reviews"
import { ImageGallery } from "@/components/image-gallery"
import { ShareWhatsApp } from "@/components/share-whatsapp"
import { RecentlyViewedProducts } from "@/components/recently-viewed-products"
import { ProductTabs } from "@/components/product-tabs"
import { PriceUSD } from "@/components/price-usd"
import { SafeImage } from "@/components/safe-image"
import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import content from "@/content/es.json"
import { createClient } from "@ai-whisperers/auth/supabase/client"

const c = content as any
const s = c.store || {}
const staticProducts = c.home?.productCatalog?.products || []
const bc = c.breadcrumbs || {}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9áéíóúñü]+/g, "-").replace(/-+$/, "")
}

function parseGs(priceStr: string) {
  return parseInt(priceStr.replace(/[^\d]/g, ""), 10) || 0
}

/* ------------------------------------------------------------------ */
/*  Trust icons                                                          */
/* ------------------------------------------------------------------ */
function TrustBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <p className="text-xs font-medium text-foreground">{label}</p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Related product card (lightweight)                                   */
/* ------------------------------------------------------------------ */
function RelatedCard({ product }: { product: any }) {
  const href = `/producto/${slugify(product.name)}`
  const priceVal = parseGs(product.price)
  const hasStock = (product.stock ?? 999) > 0

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-all hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.imageUrl ? (
          <SafeImage
            src={product.imageUrl}
            alt={product.name}
            width={300}
            height={300}
            containerClassName="h-full w-full"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-muted-foreground/25">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}
        {!hasStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <span className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-foreground">
              Agotado
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="text-xs font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </p>
        <div className="mt-auto flex items-baseline gap-1.5 pt-1">
          <p className="text-sm font-bold text-foreground">{product.price}</p>
          {priceVal > 0 && <PriceUSD pygStr={product.price} />}
        </div>
      </div>
    </Link>
  )
}

/* ------------------------------------------------------------------ */
/*  Main component                                                      */
/* ------------------------------------------------------------------ */
export default function ProductPageContent({ slug }: { slug: string }) {
  const [cartOpen, setCartOpen] = useState(false)
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [dbProducts, setDbProducts] = useState<any[]>([])
  const [dbLoaded, setDbLoaded] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<string>("")
  const supabase = createClient()

  useEffect(() => {
    ;(async () => {
      try {
        const { data, error } = await supabase.from("ej_products").select("*")
        if (error) {
          console.error("Failed to fetch products:", error)
        } else if (data && data.length > 0) {
          setDbProducts(data.map((p) => ({
            id: p.id,
            name: p.name, category: p.category, price: p.price,
            priceBefore: p.price_before, description: p.description,
            brand: p.brand, specs: p.specs, stock: p.stock,
            weight: p.weight, imageUrl: p.image_url, isNew: p.is_new, featured: p.featured,
            variants: p.variants,
          })))
          console.log(`Loaded ${data.length} products from DB`)
        }
      } catch (err) {
        console.error("Exception fetching products:", err)
      } finally {
        setDbLoaded(true)
      }
    })()
  }, [])

  const allProducts = dbProducts.length > 0 ? dbProducts : staticProducts
  const product = useMemo(() => allProducts.find((p: any) => slugify(p.name) === slug), [slug, allProducts])

  /* Wait for DB before deciding 404 — avoids flash on first render */
  if (!product && dbLoaded) notFound()

  /* Loading skeleton while DB fetches */
  if (!product) {
    return (
      <>
        <Header onCartClick={() => setCartOpen(true)} />
        <section className="bg-background py-6 sm:py-8">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-6 h-3 w-32 animate-pulse rounded bg-muted" />
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="aspect-square animate-pulse rounded-xl bg-muted" />
              <div className="space-y-4">
                <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                <div className="h-10 w-40 animate-pulse rounded bg-muted" />
                <div className="h-12 w-full animate-pulse rounded bg-muted" />
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </>
    )
  }

  const priceNum = parseGs(product.price)
  const specLines = (product.specs || "").split("|").map((s: string) => s.trim()).filter(Boolean)

  // Variant handling
  const variantList = useMemo(() => {
    if (!product.variants || !Array.isArray(product.variants)) return []
    return product.variants as Array<{ sku?: string; color?: string; size?: string; price?: string; stock?: number }>
  }, [product.variants])

  const selectedVariantData = useMemo(() => {
    if (!selectedVariant || variantList.length === 0) return null
    return variantList.find((v) => [v.sku, v.color, v.size].filter(Boolean).join(" / ") === selectedVariant) || null
  }, [selectedVariant, variantList])

  const effectivePrice = selectedVariantData?.price || product.price
  const effectivePriceNum = parseGs(effectivePrice)
  const effectiveStock = selectedVariantData?.stock ?? product.stock

  const handleAdd = () => {
    const variantLabel = selectedVariant || undefined
    const itemBase = {
      id: product.id || product.slug || product.name,
      productId: product.id || product.slug || product.name,
      name: product.name,
      price: effectivePrice,
      priceGs: effectivePriceNum,
      image: product.imageUrl,
      category: product.category,
      priceBefore: product.priceBefore,
      variant: variantLabel,
    }
    addItem(itemBase)
    Array.from({ length: qty - 1 }).forEach(() => addItem(itemBase))
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const imageSources = [product.imageUrl].filter(Boolean)
  const related = allProducts.filter((p: any) => p.category === product.category && p.name !== product.name).slice(0, 4)

  /* --- Schema.org JSON-LD --- */
  const baseUrl = "https://tiendaelviajero.com.py"
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.name,
    image: product.imageUrl || `${baseUrl}/images/og-viajero.webp`,
    sku: selectedVariantData?.sku || product.id || undefined,
    brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "PYG",
      price: priceNum.toString(),
      availability: (effectiveStock ?? 0) > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${baseUrl}/producto/${slug}`,
      priceValidUntil: new Date(Date.now() + 365 * 86400000).toISOString().split("T")[0],
      seller: { "@type": "Organization", name: "El Viajero" },
    },
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: bc.home || "Inicio", item: `${baseUrl}/` },
      { "@type": "ListItem", position: 2, name: s.title || "Tienda", item: `${baseUrl}/tienda` },
      { "@type": "ListItem", position: 3, name: product.name, item: `${baseUrl}/producto/${slug}` },
    ],
  }

  return (
    <>
      {/* Structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Header onCartClick={() => setCartOpen(true)} />
      <CartToastListener />

      <section className="bg-background py-6 sm:py-8">
        <div className="mx-auto max-w-6xl px-4">
          {/* Breadcrumbs */}
          <nav className="mb-6 flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">{bc.home || "Inicio"}</Link>
            <span>/</span>
            <Link href="/tienda" className="hover:text-primary transition-colors">{s.title || "Tienda"}</Link>
            {product.category && (
              <>
                <span>/</span>
                <Link
                  href={`/tienda?cat=${encodeURIComponent(product.category)}`}
                  className="hover:text-primary transition-colors"
                >
                  {product.category}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-foreground font-medium">{product.name}</span>
          </nav>

          {/* Main grid */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Image gallery */}
            <ImageGallery
              images={imageSources}
              productName={product.name}
              isNew={product.isNew}
              hasDiscount={!!product.priceBefore}
            />

            {/* Product info */}
            <div className="flex flex-col">
              {product.brand && (
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">{product.brand}</p>
              )}
              <h1 className="mt-1 text-2xl font-bold text-foreground lg:text-3xl">{product.name}</h1>
              {product.description && (
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{product.description}</p>
              )}

              {/* Price */}
              <div className="mt-6 flex items-baseline gap-3">
                <span className="text-3xl font-bold text-foreground">{effectivePrice}</span>
                {priceNum > 0 && <PriceUSD pygStr={effectivePrice} />}
                {product.priceBefore && (
                  <span className="text-lg text-muted-foreground line-through">{product.priceBefore}</span>
                )}
              </div>

              {/* Variants */}
              {variantList.length > 0 && (
                <div className="mt-5 space-y-3">
                  {Array.from(new Set(variantList.map((v) => v.color).filter(Boolean))).length > 0 && (
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Color</label>
                      <div className="flex flex-wrap gap-2">
                        {Array.from(new Set(variantList.map((v) => v.color).filter(Boolean))).map((color) => (
                          <button
                            key={color}
                            onClick={() => {
                              const sizes = variantList.filter((v) => v.color === color).map((v) => v.size).filter(Boolean)
                              setSelectedVariant([color, sizes[0]].filter(Boolean).join(" / "))
                            }}
                            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                              selectedVariant.startsWith(color + " /") || selectedVariant === color
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border text-muted-foreground hover:border-primary/50"
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {Array.from(new Set(variantList.map((v) => v.size).filter(Boolean))).length > 0 && (
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Tamaño / Capacidad</label>
                      <div className="flex flex-wrap gap-2">
                        {Array.from(new Set(variantList.map((v) => v.size).filter(Boolean))).map((size) => (
                          <button
                            key={size}
                            onClick={() => {
                              const colors = variantList.filter((v) => v.size === size).map((v) => v.color).filter(Boolean)
                              setSelectedVariant([colors[0], size].filter(Boolean).join(" / "))
                            }}
                            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                              selectedVariant.endsWith("/ " + size) || selectedVariant === size
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border text-muted-foreground hover:border-primary/50"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedVariant && selectedVariantData && (
                    <p className="text-xs text-muted-foreground">
                      SKU: <span className="font-mono text-foreground">{selectedVariantData.sku || "—"}</span>
                      {selectedVariantData.stock !== undefined && (
                        <span className="ml-3">
                          Stock: <span className="text-foreground">{selectedVariantData.stock} un.</span>
                        </span>
                      )}
                    </p>
                  )}
                </div>
              )}

              {/* Specs summary */}
              {specLines.length > 0 && (
                <div className="mt-5 rounded-xl border border-border bg-surface p-4">
                  <h3 className="mb-2 text-sm font-semibold text-foreground">{s.specifications || "Especificaciones"}</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                    {specLines.slice(0, 6).map((spec: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {spec}
                      </div>
                    ))}
                    {product.weight && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {s.weight || "Peso"}: {product.weight}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Stock status */}
              <div className="mt-4">
                {(effectiveStock ?? 999) > 5 ? (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success">
                    <span className="h-2 w-2 rounded-full bg-success" />
                    {s.inStock || "En stock"}
                    {effectiveStock !== undefined && <span className="text-muted-foreground font-normal">({effectiveStock} un.)</span>}
                  </span>
                ) : (effectiveStock ?? 0) > 0 ? (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-warning">
                    <span className="h-2 w-2 rounded-full bg-warning animate-pulse" />
                    {s.lastUnits || "Últimas"} {effectiveStock} {s.remaining || "unidades"}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-destructive">
                    <span className="h-2 w-2 rounded-full bg-destructive" />
                    {s.soldOut || "Agotado"}
                  </span>
                )}
              </div>

              {/* Quantity + Add to cart + WhatsApp */}
              <div className="mt-6 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  {/* Quantity */}
                  <div className="flex items-center rounded-lg border border-border bg-background">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      disabled={qty <= 1}
                      className="flex h-11 w-10 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                      aria-label="Disminuir"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /></svg>
                    </button>
                    <span className="flex h-11 w-12 items-center justify-center text-sm font-semibold text-foreground">{qty}</span>
                    <button
                      onClick={() => setQty(qty + 1)}
                      className="flex h-11 w-10 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Aumentar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
                    </button>
                  </div>

                  {/* Add button */}
                  <button
                    onClick={handleAdd}
                    disabled={!effectiveStock || added}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold transition-all active:scale-[0.98] ${
                      !effectiveStock
                        ? "cursor-not-allowed bg-muted text-muted-foreground"
                        : added
                        ? "bg-success text-success-foreground"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                  >
                    {added ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5" /></svg>
                        {s.added || "Agregado"}
                      </>
                    ) : !effectiveStock ? (
                      s.soldOut || "Agotado"
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                        {s.addToCart || "Agregar al carrito"}
                      </>
                    )}
                  </button>
                </div>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${c.home?.productCatalog?.whatsappPhone || "595984009751"}?text=${encodeURIComponent(
                    (c.home?.productCatalog?.orderMessageTemplate || "Hola! Me interesa {{productName}} ({{productPrice}}). Quiero saber disponibilidad y formas de pago.")
                      .replace("{{productName}}", product.name)
                      .replace("{{productPrice}}", product.price)
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-lg border border-border py-3 text-sm font-semibold text-foreground transition-all hover:bg-muted active:scale-[0.98]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  {c.home?.productCatalog?.orderButtonText || "Consultar por WhatsApp"}
                </a>
              </div>

              {/* Back in stock */}
              {!effectiveStock && (
                <div className="mt-4 rounded-xl border border-border bg-surface p-4">
                  <p className="mb-3 text-sm font-medium text-muted-foreground">
                    {c.backInStock?.cta || "Producto agotado. ¿Querés que te avisemos cuando vuelva?"}
                  </p>
                  <BackInStockForm productName={product.name} />
                </div>
              )}

              {/* Trust badges */}
              <div className="mt-8 grid grid-cols-3 gap-3 rounded-xl border border-border bg-surface p-4">
                <TrustBadge
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" /><path d="M1 10h22" />
                    </svg>
                  }
                  label={s.shippingFullCountry || "Envío a todo PY"}
                />
                <TrustBadge
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  }
                  label={s.qualityGuarantee || "Garantía de calidad"}
                />
                <TrustBadge
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  }
                  label={s.whatsappSupport || "Soporte WhatsApp"}
                />
              </div>

              <ShareWhatsApp
                productName={product.name}
                productUrl={typeof window !== "undefined" ? window.location.href : ""}
              />
            </div>
          </div>

          {/* Tabs */}
          <ProductTabs
            tabs={[
              {
                id: "desc",
                label: s.description || "Descripción",
                content: <p className="text-sm leading-relaxed text-muted-foreground">{product.description || "Sin descripción disponible."}</p>,
              },
              {
                id: "specs",
                label: s.specifications || "Especificaciones",
                content: (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {specLines.map((spec: string, i: number) => (
                      <div key={i} className="rounded-lg border border-border bg-surface p-3">
                        <p className="text-xs text-muted-foreground">{s.specifications || "Especificación"}</p>
                        <p className="mt-0.5 text-sm font-medium text-foreground">{spec}</p>
                      </div>
                    ))}
                    {product.weight && (
                      <div className="rounded-lg border border-border bg-surface p-3">
                        <p className="text-xs text-muted-foreground">{s.weight || "Peso"}</p>
                        <p className="mt-0.5 text-sm font-medium text-foreground">{product.weight}</p>
                      </div>
                    )}
                  </div>
                ),
              },
              {
                id: "shipping",
                label: s.shipping || "Envío",
                content: (
                  <div className="rounded-xl border border-border bg-surface p-6">
                    <h3 className="mb-3 font-semibold text-foreground">{c.shipping?.title || "Opciones de envío"}</h3>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5 text-base">📦</span>
                        <p>{c.shipping?.delivery || "Envío a domicilio"}: Gs. 10.000 - Gs. 25.000 {c.shipping?.perCity || "según ciudad"}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5 text-base">🏪</span>
                        <p>{c.shipping?.pickup || "Retiro en tienda"}: {c.shipping?.free || "Gratis"}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5 text-base">⏱</span>
                        <p>{c.shipping?.timing || "Tiempo de entrega"}: 2-5 {c.shipping?.businessDays || "días hábiles"}</p>
                      </div>
                    </div>
                  </div>
                ),
              },
            ]}
          />

          {/* Recently viewed */}
          <RecentlyViewedProducts exclude={product.name} />

          {/* Reviews */}
          <ProductReviews productName={product.name} />

          {/* Related products */}
          {related.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-6 text-xl font-bold text-foreground">{s.relatedProducts || "Productos relacionados"}</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {related.map((p: any, i: number) => (
                  <RelatedCard key={i} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </section>

      <Footer />
      <WhatsAppFloat
        phone={c.home?.contact?.whatsapp || process.env.NEXT_PUBLIC_WHATSAPP || "595984009751"}
        message={c.whatsapp?.defaultMessage || "Hola! Quiero informacion"}
      />
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
      <CookieConsent />
    </>
  )
}
