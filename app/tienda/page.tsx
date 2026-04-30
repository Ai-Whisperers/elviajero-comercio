"use client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartSidebar } from "@/components/cart-sidebar"
import { ProductModal } from "@/components/product-modal"
import { CartProvider, useCart } from "@/lib/cart-context"
import content from "@/content/es.json"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

const c = content as any
const cat = c.home?.productCatalog || {}
const cats = cat.categories || []
const products = cat.products || []

function TiendaContent() {
  const { addItem } = useCart()
  const [cartOpen, setCartOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  const parseGs = (s: string) => parseInt(s.replace(/[^\d]/g, ""), 10) || 0

  return (
    <>
      <Header onCartClick={() => setCartOpen(true)} />

      <section className="bg-primary py-12 text-center text-primary-foreground">
        <h1 className="text-4xl font-bold">Tienda Online</h1>
        <p className="mt-2 text-primary-foreground/80">{c.tienda?.hero?.subheadline}</p>
      </section>

      {c.tienda?.trustBadges?.items?.length > 0 && (
        <section className="bg-surface-light py-8">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(c.tienda.trustBadges.items || []).map((b: any, i: number) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-white p-4">
                  <div>
                    <p className="font-semibold text-foreground">{b.text}</p>
                    <p className="text-xs text-muted-foreground">{b.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-background py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-6 text-2xl font-bold text-foreground">{cat.title}</h2>
          {cats.map((category: string) => (
            <div key={category} id={category.toLowerCase().replace(/[^a-z]/g, "")} className="mb-12">
              <h3 className="mb-4 text-xl font-bold text-primary">{category}</h3>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.filter((p: any) => p.category === category).map((p: any, i: number) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer"
                    onClick={() => setSelectedProduct(p)}
                  >
                    <div className="aspect-[3/2] flex items-center justify-center overflow-hidden bg-muted">
                      {p.imageUrl ? (
                        <Image src={p.imageUrl} alt={p.name} width={400} height={267} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                          <div className="text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto text-primary/40">
                              <rect x="3" y="3" width="18" height="18" rx="2"/>
                              <circle cx="8.5" cy="8.5" r="1.5"/>
                              <path d="m21 15-5-5L5 21"/>
                            </svg>
                            <p className="mt-1 text-xs text-muted-foreground">Sin imagen</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-4" onClick={(e) => e.stopPropagation()}>
                      <h4 className="font-semibold text-foreground">{p.name}</h4>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{p.description}</p>
                      <div className="mt-2 flex items-baseline gap-2">
                        <p className="text-lg font-bold text-primary">{p.price}</p>
                        {p.priceBefore && <p className="text-sm text-muted-foreground line-through">{p.priceBefore}</p>}
                      </div>
                      {p.priceBefore && <span className="mt-1 inline-block rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">OFERTA</span>}
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => addItem({ name: p.name, price: p.price, priceGs: parseGs(p.price), imageUrl: p.imageUrl, category: p.category, priceBefore: p.priceBefore })}
                          className="flex flex-1 items-center justify-center rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                          Agregar
                        </button>
                        <a
                          href={`https://wa.me/595981234567?text=${encodeURIComponent((cat.orderMessageTemplate || "").replace("{{productName}}", p.name).replace("{{productPrice}}", p.price))}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center justify-center rounded-lg border border-primary px-3 py-2 text-sm font-semibold text-primary transition-all hover:bg-primary/5"
                        >
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </>
  )
}

export default function TiendaPage() {
  return (
    <CartProvider>
      <TiendaContent />
    </CartProvider>
  )
}
