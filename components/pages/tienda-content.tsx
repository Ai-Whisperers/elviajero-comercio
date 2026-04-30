"use client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartSidebar } from "@/components/cart-sidebar"
import { ProductModal } from "@/components/product-modal"
import { CookieConsent } from "@/components/cookie-consent"
import { SearchAndFilters } from "@/components/search-filters"
import { CartProvider, useCart } from "@/lib/cart-context"
import { ToastProvider } from "@/components/toast"
import { CartToastListener } from "@/components/cart-toast-listener"
import { useWishlist, useRecentlyViewed } from "@/lib/wishlist"
import content from "@/content/es.json"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"

const c = content as any
const cat = c.home?.productCatalog || {}
const cats = cat.categories || []
const allProducts = cat.products || []
const showOutOfStock = c.home?.showOutOfStock !== false

function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9áéíóúñü]+/g, "-").replace(/-+$/, "") }

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">Agotado</span>
  if (stock <= 3) return <span className="rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning">Últimos {stock}</span>
  if (stock <= 5) return <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600">Quedan {stock}</span>
  return null
}

function ProductCard({ p, onClick, addItem, isWished, toggleWish }: any) {
  const parseGs = (s: string) => parseInt(s.replace(/[^\d]/g, ""), 10) || 0
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <button
        onClick={(e) => { e.stopPropagation(); toggleWish(p.name) }}
        className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-muted-foreground shadow-sm transition-all hover:bg-white hover:text-accent"
        aria-label={isWished(p.name) ? "Quitar de favoritos" : "Agregar a favoritos"}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={isWished(p.name) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        </svg>
      </button>
      <Link href={`/producto/${slugify(p.name)}`} onClick={() => onClick(p)}>
        <div className="aspect-[3/2] flex items-center justify-center overflow-hidden bg-muted p-4">
          {p.imageUrl ? <Image src={p.imageUrl} alt={p.name} width={400} height={267} className="h-full w-full object-contain" /> : <div className="text-center"><p className="text-xs text-muted-foreground">Sin imagen</p></div>}
        </div>
      </Link>
      <div className="p-4">
        <div className="mb-1 flex items-center justify-between">
          {p.brand && <span className="text-xs font-medium text-muted-foreground">{p.brand}</span>}
          {p.isNew && <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent">NUEVO</span>}
        </div>
        <Link href={`/producto/${slugify(p.name)}`} className="block">
          <h4 className="font-semibold text-foreground line-clamp-1 hover:text-primary transition-colors">{p.name}</h4>
          {p.specs && <p className="mt-0.5 text-[10px] text-muted-foreground/60 line-clamp-1">{p.specs}</p>}
        </Link>
        <div className="mt-2 flex items-baseline gap-2">
          <p className="text-xl font-bold text-primary">{p.price}</p>
          {p.priceBefore && <p className="text-sm text-muted-foreground line-through">{p.priceBefore}</p>}
        </div>
        {p.priceBefore && <span className="mt-1 inline-block rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">OFERTA</span>}
        <div className="mt-3 flex items-center gap-2">
          {p.stock !== undefined && p.stock > 0 && p.stock <= 5 && <StockBadge stock={p.stock} />}
          <button
            disabled={p.stock === 0}
            onClick={() => addItem({ name: p.name, price: p.price, priceGs: parseGs(p.price), imageUrl: p.imageUrl, category: p.category, priceBefore: p.priceBefore })}
            className={`flex flex-1 items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${p.stock === 0 ? "cursor-not-allowed bg-muted text-muted-foreground" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            {p.stock === 0 ? "Agotado" : "Agregar"}
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

  // Filter out OOS products by default
  const visibleProducts = showOOS ? allProducts : allProducts.filter((p: any) => (p.stock ?? 0) > 0)
  const displayProducts = filtered ?? visibleProducts

  const handleClick = (p: any) => { addRecent(p.name); setSelectedProduct(p) }
  const groupedCats = cats.filter((cat: string) => displayProducts.some((p: any) => p.category === cat))

  return (
    <>
      <Header onCartClick={() => setCartOpen(true)} />
      <CartToastListener />
      <section className="bg-primary py-12 text-center text-primary-foreground">
        <h1 className="text-4xl font-bold">Tienda Online</h1>
        <p className="mt-2 text-primary-foreground/80">{c.tienda?.hero?.subheadline}</p>
      </section>
      <section className="bg-surface-light py-6">
        <div className="mx-auto max-w-7xl px-4">
          <SearchAndFilters products={allProducts} categories={cats} onFilteredProducts={setFiltered} />
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>{displayProducts.length} de {allProducts.length} productos visibles</span>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" checked={showOOS} onChange={() => setShowOOS(!showOOS)} className="rounded border-border text-primary focus:ring-primary" />
              Mostrar agotados
            </label>
          </div>
        </div>
      </section>
      <section className="bg-background py-16"><div className="mx-auto max-w-7xl px-4">
        {displayProducts.length === 0 && <div className="py-20 text-center"><p className="text-lg text-muted-foreground">No encontramos productos con esos filtros.</p></div>}
        {groupedCats.map((category: string) => (
          <div key={category} className="mb-12 last:mb-0">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">{category}</h2>
              <Link href={`/categoria/${category.toLowerCase().replace(/[^a-z]/g, "")}`} className="text-sm font-semibold text-primary hover:underline">Ver todo</Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {displayProducts.filter((p: any) => p.category === category).map((p: any, i: number) => (
                <ProductCard key={i} p={p} onClick={handleClick} addItem={addItem} isWished={isWished} toggleWish={toggle} />
              ))}
            </div>
          </div>
        ))}
      </div></section>
      <Footer />
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      <CookieConsent />
    </>
  )
}

export default function TiendaPage() {
  return (
    <CartProvider>
      <ToastProvider>
        <TiendaContent />
      </ToastProvider>
    </CartProvider>
  )
}
