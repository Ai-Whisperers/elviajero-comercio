"use client"
import { useCart } from "@/lib/cart-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartSidebar } from "@/components/cart-sidebar"
import { CookieConsent } from "@/components/cookie-consent"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { CartToastListener } from "@/components/cart-toast-listener"
import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import content from "@/content/es.json"

const c = content as any
const allProducts = c.home?.productCatalog?.products || []
const categories = c.home?.productCatalog?.categories || []

function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9áéíóúñü]+/g, "-").replace(/-+$/, "") }

export default function ProductPageContent({ slug }: { slug: string }) {
  const [cartOpen, setCartOpen] = useState(false)
  const { addItem } = useCart()
  const [selectedImage, setSelectedImage] = useState(0)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const product = useMemo(() => allProducts.find((p: any) => slugify(p.name) === slug), [slug])
  if (!product) notFound()

  const parseNum = (s: string) => parseInt(s.replace(/[^0-9]/g, ""), 10) || 0
  const imageSources = [product.imageUrl].filter(Boolean)

  const handleAdd = () => {
    addItem({
      name: product.name, price: product.price, priceGs: parseNum(product.price),
      imageUrl: product.imageUrl, category: product.category, priceBefore: product.priceBefore,
    })
    Array.from({ length: qty - 1 }).forEach(() => addItem({
      name: product.name, price: product.price, priceGs: parseNum(product.price),
      imageUrl: product.imageUrl, category: product.category,
    }))
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const specLines = (product.specs || "").split("|").map((s: string) => s.trim()).filter(Boolean)

  return (
    <>
      <Header onCartClick={() => setCartOpen(true)} />
      <CartToastListener />
      <section className="bg-background py-8">
        <div className="mx-auto max-w-6xl px-4">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-primary">Inicio</Link>
            <span>/</span>
            <Link href="/tienda" className="hover:text-primary">Tienda</Link>
            <span>/</span>
            {product.category && <span className="hover:text-primary">{product.category}</span>}
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Image gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-surface">
                {product.imageUrl && (
                  <Image src={product.imageUrl} alt={product.name} fill className="object-contain p-8 hover:scale-110 transition-transform duration-500" />
                )}
                {product.isNew && (
                  <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">NUEVO</span>
                )}
                {product.priceBefore && (
                  <span className="absolute right-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">OFERTA</span>
                )}
              </div>
              {imageSources.length > 1 && (
                <div className="flex gap-3">
                  {imageSources.map((src: string, i: number) => (
                    <button key={i} onClick={() => setSelectedImage(i)}
                      className={`h-16 w-16 overflow-hidden rounded-lg border-2 transition-all ${
                        i === selectedImage ? "border-primary" : "border-border"
                      }`}>
                      <Image src={src} alt="" width={64} height={64} className="h-full w-full object-contain p-1" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product info */}
            <div className="flex flex-col">
              {product.brand && (
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">{product.brand}</p>
              )}
              <h1 className="mt-1 text-2xl font-bold text-foreground lg:text-3xl">{product.name}</h1>
              <p className="mt-2 text-muted-foreground">{product.description}</p>

              {/* Price */}
              <div className="mt-6 flex items-baseline gap-3">
                <span className="text-3xl font-bold text-foreground">{product.price}</span>
                {product.priceBefore && (
                  <span className="text-lg text-muted-foreground line-through">{product.priceBefore}</span>
                )}
              </div>

              {/* Specs */}
              {specLines.length > 0 && (
                <div className="mt-6 rounded-xl border border-border bg-surface p-4">
                  <h3 className="mb-2 text-sm font-semibold text-foreground">Especificaciones</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {specLines.map((spec: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {spec}
                      </div>
                    ))}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Peso: {product.weight || "—"}
                    </div>
                  </div>
                </div>
              )}

              {/* Stock */}
              <div className="mt-4 flex items-center gap-2">
                {product.stock > 5 ? (
                  <span className="flex items-center gap-1 text-sm font-medium text-success">● En stock ({product.stock} un.)</span>
                ) : product.stock > 0 ? (
                  <span className="flex items-center gap-1 text-sm font-medium text-warning">● Últimas {product.stock} unidades</span>
                ) : (
                  <span className="flex items-center gap-1 text-sm font-medium text-destructive">● Agotado</span>
                )}
              </div>

              {/* Quantity + Add to cart */}
              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center rounded-lg border border-input">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="flex h-10 w-10 items-center justify-center text-foreground hover:bg-muted transition-colors">−</button>
                  <span className="flex h-10 w-12 items-center justify-center text-sm font-semibold text-foreground">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="flex h-10 w-10 items-center justify-center text-foreground hover:bg-muted transition-colors">+</button>
                </div>
                <button onClick={handleAdd} disabled={!product.stock || added}
                  className="flex-1 rounded-lg bg-primary py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50">
                  {added ? "✓ Agregado" : !product.stock ? "Agotado" : "Agregar al carrito"}
                </button>
              </div>

              {/* Trust badges */}
              <div className="mt-8 grid grid-cols-3 gap-3 rounded-xl border border-border bg-surface p-4">
                <div className="text-center">
                  <div className="text-lg mb-1">🚚</div>
                  <p className="text-xs font-medium text-foreground">Envío a todo PY</p>
                </div>
                <div className="text-center">
                  <div className="text-lg mb-1">🛡</div>
                  <p className="text-xs font-medium text-foreground">Garantía de calidad</p>
                </div>
                <div className="text-center">
                  <div className="text-lg mb-1">💬</div>
                  <p className="text-xs font-medium text-foreground">Soporte WhatsApp</p>
                </div>
              </div>
            </div>
          </div>

          {/* Related products */}
          {allProducts.filter((p: any) => p.category === product.category && p.name !== product.name).length > 0 && (
            <section className="mt-16">
              <h2 className="mb-6 text-xl font-bold text-foreground">Productos relacionados</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {allProducts.filter((p: any) => p.category === product.category && p.name !== product.name).slice(0, 4).map((p: any, i: number) => (
                  <Link key={i} href={`/producto/${slugify(p.name)}`} className="group rounded-xl border border-border bg-surface p-3 transition-all hover:-translate-y-1 hover:shadow-md">
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
