"use client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CookieConsent } from "@/components/cookie-consent"
import content from "@/content/es.json"
import Link from "next/link"
import Image from "next/image"
import { CartProvider } from "@/lib/cart-context"

const c = content as any
const products = c.home?.productCatalog?.products || []
const submenu = c.categoryMenu || {}

export function CategoryContent({ slug, name, emoji, description }: {
  slug: string; name: string; emoji: string; description: string
}) {
  const catProducts = products.filter((p: any) => p.category === name)
  const subItems = submenu[slug] || []

  return (
    <CartProvider>
      <Header />
      <section className="bg-primary py-12 text-center text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(/images/categories/${slug}.svg)`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="relative z-10">
          <span className="text-5xl mb-2 block">{emoji}</span>
          <h1 className="text-4xl font-bold">{name}</h1>
          <p className="mt-2 text-primary-foreground/80 max-w-xl mx-auto">{description}</p>
        </div>
      </section>
      {subItems.length > 0 && (
        <section className="bg-surface-light py-6">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex flex-wrap gap-2">
              {subItems.map((item: string) => (
                <Link key={item} href="/tienda" className="rounded-full border border-border bg-white px-4 py-2 text-xs font-medium text-foreground transition-all hover:bg-primary hover:text-primary-foreground">
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      <section className="bg-background py-16">
        <div className="mx-auto max-w-7xl px-4">
          {catProducts.length === 0 && <div className="py-20 text-center"><p className="text-muted-foreground">Próximamente más productos.</p><Link href="/tienda" className="mt-4 inline-block text-primary hover:underline">← Volver a la tienda</Link></div>}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {catProducts.map((p: any, i: number) => (
              <div key={i} className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                <Link href="/tienda"><div className="aspect-[3/2] flex items-center justify-center bg-muted p-4">{p.imageUrl && <Image src={p.imageUrl} alt={p.name} width={400} height={267} className="h-full w-full object-contain" />}</div></Link>
                <div className="p-4">
                  {p.brand && <p className="text-xs font-medium text-muted-foreground">{p.brand}</p>}
                  <Link href="/tienda"><h3 className="font-semibold text-foreground hover:text-primary line-clamp-1">{p.name}</h3></Link>
                  <p className="text-lg font-bold text-primary mt-2">{p.price}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center"><Link href="/tienda" className="text-sm text-primary hover:underline">← Ver todas las categorías</Link></div>
        </div>
      </section>
      <Footer />
      <CookieConsent />
    </CartProvider>
  )
}
