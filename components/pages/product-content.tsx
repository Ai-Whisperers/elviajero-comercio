"use client"
import { useCart } from "@/lib/cart-context"
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
import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import content from "@/content/es.json"
import { createClient } from "@/lib/supabase/client"

const c = content as any
const staticProducts = c.home?.productCatalog?.products || []
const categories = c.home?.productCatalog?.categories || []

function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9áéíóúñü]+/g, "-").replace(/-+$/, "") }

export default function ProductPageContent({ slug }: { slug: string }) {
  const [cartOpen, setCartOpen] = useState(false)
  const { addItem } = useCart()
  const [selectedImage, setSelectedImage] = useState(0)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [dbProducts, setDbProducts] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    supabase.from("ej_products").select("*").then(({ data }) => {
      if (data && data.length > 0) {
        setDbProducts(data.map(p => ({
          name: p.name, category: p.category, price: p.price,
          priceBefore: p.price_before, description: p.description,
          brand: p.brand, specs: p.specs, stock: p.stock,
          weight: p.weight, imageUrl: p.image_url, isNew: p.is_new, featured: p.featured,
        })))
      }
    })
  }, [supabase])

  const allProducts = dbProducts.length > 0 ? dbProducts : staticProducts
  const product = useMemo(() => allProducts.find((p: any) => slugify(p.name) === slug), [slug, allProducts])
  if (!product) notFound()

  const parseNum = (s: string) => parseInt(s.replace(/[^0-9]/g, ""), 10) || 0
  const imageSources = [product.imageUrl].filter(Boolean)
  const priceNum = parseNum(product.price)
  const specLines = (product.specs || "").split("|").map((s: string) => s.trim()).filter(Boolean)

  const handleAdd = () => {
    addItem({ name: product.name, price: product.price, priceGs: parseNum(product.price), imageUrl: product.imageUrl, category: product.category, priceBefore: product.priceBefore })
    Array.from({ length: qty - 1 }).forEach(() => addItem({ name: product.name, price: product.price, priceGs: parseNum(product.price), imageUrl: product.imageUrl, category: product.category }))
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({"@context":"https://schema.org/","@type":"Product","name": product.name,"description": product.description || product.name,"image": product.imageUrl,offers: {"@type":"Offer","priceCurrency":"PYG","price": priceNum,"availability": (product.stock ?? 0) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock","url": "https://el-viajero.paragu-ai.com/producto/" + slug}})}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement": [{"@type":"ListItem","position":1,"name":"Inicio","item":"https://el-viajero.paragu-ai.com/"},{"@type":"ListItem","position":2,"name":"Tienda","item":"https://el-viajero.paragu-ai.com/tienda"},{"@type":"ListItem","position":3,"name":product.name,"item":"https://el-viajero.paragu-ai.com/producto/" + slug}]})}} />
      <Header onCartClick={() => setCartOpen(true)} />
      <CartToastListener />
      <section className="bg-background py-8">
        <div className="mx-auto max-w-6xl px-4">
          <nav className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-primary">Inicio</Link><span>/</span>
            <Link href="/tienda" className="hover:text-primary">Tienda</Link><span>/</span>
            {product.category && <><span className="hover:text-primary">{product.category}</span><span>/</span></>}
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-2">
            <ImageGallery images={imageSources} productName={product.name} isNew={product.isNew} hasDiscount={!!product.priceBefore} />
            <div className="flex flex-col">
              {product.brand && <p className="text-xs font-semibold uppercase tracking-wider text-primary">{product.brand}</p>}
              <h1 className="mt-1 text-2xl font-bold text-foreground lg:text-3xl">{product.name}</h1>
              <p className="mt-2 text-muted-foreground">{product.description}</p>
              <div className="mt-6 flex items-baseline gap-3">
                <span className="text-3xl font-bold text-foreground">{product.price}</span>
                {product.priceBefore && <span className="text-lg text-muted-foreground line-through">{product.priceBefore}</span>}
              </div>
              {specLines.length > 0 && (
                <div className="mt-6 rounded-xl border border-border bg-surface p-4">
                  <h3 className="mb-2 text-sm font-semibold text-foreground">Especificaciones</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {specLines.map((spec: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground"><div className="h-1.5 w-1.5 rounded-full bg-primary" />{spec}</div>
                    ))}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><div className="h-1.5 w-1.5 rounded-full bg-primary" />Peso: {product.weight || "—"}</div>
                  </div>
                </div>
              )}
              <div className="mt-4 flex items-center gap-2">
                {product.stock > 5 ? <span className="flex items-center gap-1 text-sm font-medium text-success">● En stock ({product.stock} un.)</span>
                  : product.stock > 0 ? <span className="flex items-center gap-1 text-sm font-medium text-warning">● Últimas {product.stock} unidades</span>
                  : <span className="flex items-center gap-1 text-sm font-medium text-destructive">● Agotado</span>}
              </div>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center rounded-lg border border-input">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="flex h-10 w-10 items-center justify-center text-foreground hover:bg-muted">−</button>
                  <span className="flex h-10 w-12 items-center justify-center text-sm font-semibold text-foreground">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="flex h-10 w-10 items-center justify-center text-foreground hover:bg-muted">+</button>
                </div>
                <button onClick={handleAdd} disabled={!product.stock || added}
                  className="flex-1 rounded-lg bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50">
                  {added ? "✓ Agregado" : !product.stock ? "Agotado" : "Agregar al carrito"}
                </button>
              </div>
              {!product.stock && <div className="mt-4"><p className="mb-2 text-sm font-medium text-muted-foreground">Producto agotado. ¿Querés que te avisemos?</p><BackInStockForm productName={product.name} /></div>}
              <div className="mt-8 grid grid-cols-3 gap-3 rounded-xl border border-border bg-surface p-4">
                <div className="text-center"><div className="text-lg mb-1">🚚</div><p className="text-xs font-medium text-foreground">Envío a todo PY</p></div>
                <div className="text-center"><div className="text-lg mb-1">🛡</div><p className="text-xs font-medium text-foreground">Garantía de calidad</p></div>
                <div className="text-center"><div className="text-lg mb-1">💬</div><p className="text-xs font-medium text-foreground">Soporte WhatsApp</p></div>
              </div>
              <ShareWhatsApp productName={product.name} productUrl={typeof window !== 'undefined' ? window.location.href : ''} />
            </div>
          </div>

          <ProductTabs tabs={[
            { id: "desc", label: "Descripción", content: <p className="text-muted-foreground">{product.description}</p> },
            { id: "specs", label: "Especificaciones", content: (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {specLines.map((spec: string, i: number) => (
                  <div key={i} className="rounded-lg border border-border bg-surface p-3">
                    <p className="text-xs text-muted-foreground mb-1">Especificación</p>
                    <p className="text-sm font-medium text-foreground">{spec}</p>
                  </div>
                ))}
                <div className="rounded-lg border border-border bg-surface p-3"><p className="text-xs text-muted-foreground mb-1">Peso</p><p className="text-sm font-medium text-foreground">{product.weight || "—"}</p></div>
              </div>
            )},
            { id: "shipping", label: "Envío", content: (
              <div className="rounded-xl border border-border bg-surface p-6">
                <h3 className="font-semibold text-foreground mb-3">Opciones de envío</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>📦 Envío a domicilio: Gs. 10.000 - Gs. 25.000 según ciudad</p>
                  <p>🏪 Retiro en tienda: Gratis</p>
                  <p>⏱ Tiempo de entrega: 2-5 días hábiles</p>
                </div>
              </div>
            )},
          ]} />

          <RecentlyViewedProducts exclude={product.name} />
          <ProductReviews productName={product.name} />
          {allProducts.filter((p: any) => p.category === product.category && p.name !== product.name).length > 0 && (
            <section className="mt-16">
              <h2 className="mb-6 text-xl font-bold text-foreground">Productos relacionados</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {allProducts.filter((p: any) => p.category === product.category && p.name !== product.name).slice(0, 4).map((p: any, i: number) => (
                  <Link key={i} href={"/producto/" + slugify(p.name)} className="group rounded-xl border border-border bg-surface p-3 transition-all hover:-translate-y-1 hover:shadow-md">
                    <div className="mb-2 aspect-square flex items-center justify-center bg-muted rounded-lg p-3">
                      {p.imageUrl && <Image src={p.imageUrl} alt={p.name} width={200} height={200} className="h-full w-full object-contain" />}
                    </div>
                    <p className="text-xs font-medium text-foreground line-clamp-2 group-hover:text-primary">{p.name}</p>
                    <p className="mt-1 text-sm font-bold text-primary">{p.price}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </section>
      <Footer />
      <WhatsAppFloat phone={c.home?.contact?.whatsapp || "595981234567"} message={c.whatsapp?.defaultMessage || "Hola! Quiero informacion"} />
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
      <CookieConsent />
    </>
  )
}
