"use client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CookieConsent } from "@/components/cookie-consent"
import { Breadcrumbs, EmptyState } from "@/components/ui"
import { useState, useEffect } from "react"
import Link from "next/link"
import content from "@/content/es.json"

const c = content as any
const allProducts = c.home?.productCatalog?.products || []

export default function FavoritosPage() {
  const [wishlist, setWishlist] = useState<string[]>([])
  useEffect(() => {
    try {
      const saved = localStorage.getItem("viajero-wishlist")
      if (saved) setWishlist(JSON.parse(saved))
    } catch {}
  }, [])

  const wishedProducts = allProducts.filter((p: any) => wishlist.includes(p.name))

  return (
    <>
      <Header />
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Mi Cuenta", href: "/mi-cuenta" }, { label: "Favoritos" }]} />
      <section className="bg-background py-12">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="text-3xl font-bold text-foreground mb-8">Mis Favoritos</h1>
          {wishedProducts.length === 0 ? (
            <EmptyState icon="❤️" title="Sin favoritos aún" description="Guardá productos que te interesen para encontrarlos rápido." action={{ label: "Explorar productos", href: "/tienda" }} />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {wishedProducts.map((p: any, i: number) => {
                const slug = p.name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-")
                return (
                  <Link key={i} href={`/producto/${slug}`} className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                    <div className="aspect-[3/2] bg-muted p-4 flex items-center justify-center">
                      {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="h-full w-full object-contain" />}
                    </div>
                    <div className="p-4">
                      <p className="font-semibold text-foreground line-clamp-1">{p.name}</p>
                      <p className="text-lg font-bold text-primary mt-1">{p.price}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
      <Footer />
      <CookieConsent />
    </>
  )
}
