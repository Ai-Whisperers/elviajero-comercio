"use client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartSidebar } from "@/components/cart-sidebar"
import { ProductModal } from "@/components/product-modal"
import { CookieConsent } from "@/components/cookie-consent"
import { SearchAndFilters } from "@/components/search-filters"
import { CartProvider, useCart } from "@/lib/cart-context"
import { useWishlist, useRecentlyViewed } from "@/lib/wishlist"
import content from "@/content/es.json"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

const c = content as any
const cat = c.home?.productCatalog || {}
const cats = cat.categories || []
const allProducts = cat.products || []

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">Agotado</span>
  if (stock <= 3) return <span className="rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning">Últimos {stock}</span>
  if (stock <= 5) return <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600">Quedan {stock}</span>
  return <span className="rounded-full bg-green-700/10 px-2 py-0.5 text-xs font-medium text-green-700">En stock</span>
}

function ProductCard({ p, onClick, addItem, isWished, toggleWish }: any) {
  const parseGs = (s: string) => parseInt(s.replace(/[^\d]/g, ""), 10) || 0
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer">
      <button
        onClick={(e) => { e.stopPropagation(); toggleWish(p.name) }}
        className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-muted-foreground shadow-sm transition-all hover:bg-white hover:text-accent"
        aria-label={isWished(p.name) ? "Quitar de favoritos" : "Agregar a favoritos"}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={isWished(p.name) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        </svg>
      </button>
      <div onClick={() => onClick(p)}>
        <div className="aspect-[3/2] flex items-center justify-center overflow-hidden bg-muted p-4">
          {p.imageUrl ? <Image src={p.imageUrl} alt={p.name} width={400} height={267} className="h-full w-full object-contain" /> : <div className="text-center"><p className="text-xs text-muted-foreground">Sin imagen</p></div>}
        </div>
      </div>
      <div className="p-4" onClick={(e) => e.stopPropagation()}>
        <div className="mb-2 flex items-center justify-between">
          {p.brand && <span className="text-xs font-medium text-muted-foreground">{p.brand}</span>}
          {p.stock !== undefined && <StockBadge stock={p.stock} />}
        </div>
        <h4 className="font-semibold text-foreground line-clamp-1">{p.name}</h4>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{p.description}</p>
        {p.specs && <p className="mt-1 text-[10px] text-muted-foreground/60 line-clamp-1">{p.specs}</p>}
        <div className="mt-2 flex items-baseline gap-2">
          <p className="text-lg font-bold text-primary">{p.price}</p>
          {p.priceBefore && <p className="text-sm text-muted-foreground line-through">{p.priceBefore}</p>}
        </div>
        {p.priceBefore && <span className="mt-1 inline-block rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">OFERTA</span>}
        <div className="mt-3 flex gap-2">
          <button
            disabled={p.stock === 0}
            onClick={() => addItem({ name: p.name, price: p.price, priceGs: parseGs(p.price), imageUrl: p.imageUrl, category: p.category, priceBefore: p.priceBefore })}
            className={`flex flex-1 items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold transition-all ${p.stock === 0 ? "cursor-not-allowed bg-muted text-muted-foreground" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            {p.stock === 0 ? "Agotado" : "Agregar"}
          </button>
          <a href={`https://wa.me/595981234567?text=${encodeURIComponent((cat.orderMessageTemplate || "").replace("{{productName}}", p.name).replace("{{productPrice}}", p.price))}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
            className={`flex items-center justify-center rounded-lg border px-3 py-2 text-sm font-semibold transition-all ${p.stock === 0 ? "border-muted text-muted-foreground pointer-events-none" : "border-primary text-primary hover:bg-primary/5"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/></svg>WhatsApp
          </a>
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
  const displayProducts = filtered ?? allProducts

  const handleClick = (p: any) => { addRecent(p.name); setSelectedProduct(p) }

  const groupedCats = cats.filter((cat: string) => displayProducts.some((p: any) => p.category === cat))

  return (
    <>
      <Header onCartClick={() => setCartOpen(true)} />
      <section className="bg-primary py-12 text-center text-primary-foreground"><h1 className="text-4xl font-bold">Tienda Online</h1><p className="mt-2 text-primary-foreground/80">{c.tienda?.hero?.subheadline}</p></section>
      <section className="bg-surface-light py-6"><div className="mx-auto max-w-7xl px-4"><SearchAndFilters products={allProducts} categories={cats} onFilteredProducts={setFiltered} /></div></section>
      <section className="bg-background py-16"><div className="mx-auto max-w-7xl px-4">
        {displayProducts.length === 0 && <div className="py-20 text-center"><p className="text-lg text-muted-foreground">No encontramos productos con esos filtros.</p></div>}
        {groupedCats.length === 0 && displayProducts.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{displayProducts.map((p: any, i: number) => <ProductCard key={i} p={p} onClick={handleClick} addItem={addItem} isWished={isWished} toggleWish={toggle} />)}</div>
        )}
        {groupedCats.map((category: string) => (
          <div key={category} id={category.toLowerCase().replace(/[^a-z]/g, "")} className="mb-12">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-primary">{category}</h3>
              <span className="text-xs text-muted-foreground">{displayProducts.filter((p: any) => p.category === category).length} productos</span>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {displayProducts.filter((p: any) => p.category === category).slice(0, 8).map((p: any, i: number) => <ProductCard key={i} p={p} onClick={handleClick} addItem={addItem} isWished={isWished} toggleWish={toggle} />)}
            </div>
          </div>
        ))}
      </div></section>
      <Footer />
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
      <CookieConsent />
    </>
  )
}

export default function TiendaPage() {
  return <CartProvider><TiendaContent /></CartProvider>
}
