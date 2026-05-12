"use client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartSidebar } from "@/components/cart-sidebar"
import { ProductModal } from "@/components/product-modal"
import { CookieConsent } from "@/components/cookie-consent"
import { SearchAndFilters } from "@/components/search-filters"
import { useCart } from "@ai-whisperers/commerce/cart/cart-context"
import { CartToastListener } from "@/components/cart-toast-listener"
import { useWishlist, useRecentlyViewed } from "@/lib/wishlist"
import { PriceUSD } from "@/components/price-usd"
import { SafeImage } from "@/components/safe-image"
import content from "@/content/es.json"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useCallback } from "react"
import { createClient } from "@ai-whisperers/auth/supabase/client"

const c = content as any
const s = c.store || {}
const ui = c.ui || {}
const cats = c.home?.productCatalog?.categories || []
const cat = c.home?.productCatalog || {}
const staticProducts = cat.products || []

function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9áéíóúñü]+/g, "-").replace(/-+$/, "") }

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">{s.soldOut || "Agotado"}</span>
  if (stock <= 3) return <span className="rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning animate-pulse">{s.lastUnits || "Últimos"} {stock}</span>
  if (stock <= 5) return <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600">{(s.remaining || "Quedan")} {stock}</span>
  return null
}

function ProductCard({ p, onClick, addItem, isWished, toggleWish }: any) {
  const parseGs = (s: string) => parseInt(s.replace(/[^\d]/g, ""), 10) || 0
  const [qty, setQty] = useState(1)

  const handleAdd = useCallback(() => {
    for (let i = 0; i < qty; i++) {
      addItem({
        id: p.id || p.slug || p.name,
        productId: p.id || p.slug || p.name,
        name: p.name,
        price: p.price,
        priceGs: parseGs(p.price),
        image: p.imageUrl,
        category: p.category,
        priceBefore: p.priceBefore,
      })
    }
    setQty(1)
  }, [p, qty, addItem])

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lg">
      {/* Wishlist button */}
      <button
        onClick={(e) => { e.stopPropagation(); e.preventDefault(); toggleWish(p.name) }}
        className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-muted-foreground shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-accent"
        aria-label={isWished(p.name) ? (ui.removeFav || "Quitar de favoritos") : (ui.addFav || "Agregar a favoritos")}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={isWished(p.name) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        </svg>
      </button>

      {/* Image */}
      <Link href={`/producto/${slugify(p.name)}`} onClick={() => onClick(p)} className="block">
        <div className="aspect-[4/3] flex items-center justify-center overflow-hidden bg-muted">
          {p.imageUrl ? (
            <SafeImage src={p.imageUrl} alt={p.name} width={400} height={300} containerClassName="h-full w-full" className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-muted-foreground/30">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
              </svg>
            </div>
          )}
          {/* Sale badge overlay */}
          {p.priceBefore && (
            <span className="absolute left-2 top-2 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold text-accent-foreground shadow-sm">
              {s.sale || "OFERTA"}
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col gap-2 p-4">
        {/* Product name + specs */}
        <Link href={`/producto/${slugify(p.name)}`} className="block">
          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">{p.name}</h4>
          {p.specs && <p className="mt-0.5 text-[11px] text-muted-foreground/50 line-clamp-1">{p.specs}</p>}
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <p className="text-xl font-bold text-foreground">{p.price}</p>
          <PriceUSD pygStr={p.price} />
          {p.priceBefore && (
            <p className="text-sm text-muted-foreground line-through">{p.priceBefore}</p>
          )}
        </div>

        {/* Stock badge */}
        {p.stock !== undefined && p.stock > 0 && p.stock <= 5 && (
          <div className="flex items-center gap-1.5">
            <span className={`inline-block h-1.5 w-1.5 rounded-full ${p.stock <= 3 ? 'bg-destructive animate-pulse' : 'bg-amber-500'}`} />
            <StockBadge stock={p.stock} />
          </div>
        )}

        {/* Quantity + Add to cart */}
        <div className="mt-1 flex items-center gap-2">
          {/* Quantity selector */}
          {p.stock !== 0 && (
            <div className="flex items-center rounded-lg border border-border bg-background">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                disabled={qty <= 1}
                className="flex h-9 w-8 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/></svg>
              </button>
              <span className="flex h-9 w-8 items-center justify-center text-xs font-medium tabular-nums">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                disabled={p.stock !== undefined && qty >= p.stock}
                className="flex h-9 w-8 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
              </button>
            </div>
          )}

          {/* Add button */}
          <button
            disabled={p.stock === 0}
            onClick={handleAdd}
            className={`flex flex-1 items-center justify-center rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-150 ${
              p.stock === 0
                ? "cursor-not-allowed bg-muted text-muted-foreground"
                : "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.97]"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1.5 shrink-0">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {p.stock === 0 ? (s.soldOut || "Agotado") : (s.add || "Agregar")}
          </button>
        </div>
      </div>
    </div>
  )
}

function TiendaContent() {
  const { addItem } = useCart()
  const { isWished, toggle } = useWishlist()
  const { add: addRecent } = useRecentlyViewed()
  const [cartOpen, setCartOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [filtered, setFiltered] = useState<any[] | null>(null)
  const [showOOS, setShowOOS] = useState(false)
  const [dbProducts, setDbProducts] = useState<any[]>([])

  useEffect(() => {
    const supabase = createClient()
    supabase.from("ej_products").select("*").order("name").then(({ data }) => {
      if (data && data.length > 0) {
        setDbProducts(data.map(p => ({
          name: p.name, category: p.category, price: p.price,
          priceBefore: p.price_before, description: p.description,
          brand: p.brand, specs: p.specs, stock: p.stock,
          weight: p.weight, imageUrl: p.image_url, isNew: p.is_new, featured: p.featured,
        })))
      }
    })
  }, [])

  const allProducts = dbProducts.length > 0 ? dbProducts : staticProducts
  const visibleProducts = showOOS ? allProducts : allProducts.filter((p: any) => (p.stock ?? 0) > 0)
  const displayProducts = filtered ?? visibleProducts
  const handleClick = (p: any) => { addRecent(p.name); setSelectedProduct(p) }
  const groupedCats = cats.filter((cat: string) => displayProducts.some((p: any) => p.category === cat))

  return (
    <>
      <Header onCartClick={() => setCartOpen(true)} />
      <CartToastListener />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/95 to-primary py-20 text-center text-primary-foreground">
        <div className="pointer-events-none absolute inset-0">
          <Image
            src="/images/marketing/tienda-hero-bg.webp"
            alt=""
            fill
            className="object-cover object-center opacity-30"
            sizes="100vw"
            priority
          />
        </div>
        <div className="relative z-10 mx-auto max-w-2xl px-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{s.title || "Tienda Online"}</h1>
          <p className="mt-3 text-lg text-primary-foreground/70">{c.tienda?.hero?.subheadline}</p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-surface-light py-6">
        <div className="mx-auto max-w-7xl px-4">
          <SearchAndFilters products={allProducts} categories={cats} onFilteredProducts={setFiltered} />
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium">{displayProducts.length} {allProducts.length > 0 ? `${s.of || "de"} ${allProducts.length}` : ""} {(s.visible || "productos")}</span>
            <label className="flex cursor-pointer items-center gap-1.5 select-none">
              <input type="checkbox" checked={showOOS} onChange={() => setShowOOS(!showOOS)} className="rounded border-border text-primary focus:ring-primary" />
              {s.showOutOfStock || "Mostrar agotados"}
            </label>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="bg-background py-16">
        <div className="mx-auto max-w-7xl px-4">
          {displayProducts.length === 0 && (
            <div className="py-20 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-4 text-muted-foreground/30">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/>
              </svg>
              <p className="text-lg text-muted-foreground">{s.noProducts || "No encontramos productos con esos filtros."}</p>
            </div>
          )}
          {groupedCats.map((category: string) => (
            <div key={category} id={category.toLowerCase().replace(/[^a-z]/g, "")} className="mb-16 scroll-mt-28 last:mb-0">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">{category}</h2>
                <Link
                  href={`/categoria/${category.toLowerCase().replace(/[^a-z]/g, "")}`}
                  className="text-sm font-semibold text-primary hover:text-primary/80 hover:underline transition-colors"
                >
                  {s.viewAll || "Ver todo"} &rarr;
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {displayProducts.filter((p: any) => p.category === category).map((p: any, i: number) => (
                  <ProductCard key={p.id || p.name || i} p={p} onClick={handleClick} addItem={addItem} isWished={isWished} toggleWish={toggle} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Signals */}
      <section className="border-t border-border bg-surface-light py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div className="flex flex-col items-center gap-2 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>
              <p className="text-sm font-semibold text-foreground">{s.paymentMethods || "Medios de pago"}</p>
              <p className="text-xs text-muted-foreground">Visa, Mastercard, Bancard<br/>Transferencia, Efectivo</p>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              <p className="text-sm font-semibold text-foreground">{s.freeShipping || "Envíos a todo PY"}</p>
              <p className="text-xs text-muted-foreground">{s.freeShippingDetail || "Consultá cobertura en tu zona"}</p>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <p className="text-sm font-semibold text-foreground">{s.warranty || "Garantía"}</p>
              <p className="text-xs text-muted-foreground">{s.warrantyDetail || "Todos los productos tienen garantía"}</p>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <p className="text-sm font-semibold text-foreground">{s.whatsappSupport || "WhatsApp directo"}</p>
              <p className="text-xs text-muted-foreground">{s.whatsappSupportDetail || "Respondemos en el día"}</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      <CookieConsent />
    </>
  )
}

export default TiendaPage

function TiendaPage() {
  return <TiendaContent />
}
