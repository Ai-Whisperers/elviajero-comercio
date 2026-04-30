"use client"
import { useRecentlyViewed } from "@/lib/wishlist"
import Link from "next/link"
import Image from "next/image"
import content from "@/content/es.json"

const c = content as any
const allProducts = c.home?.productCatalog?.products || []

function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9áéíóúñü]+/g, "-").replace(/-+$/, "") }

export function RecentlyViewed() {
  const { items } = useRecentlyViewed()
  const recent = items.slice(0, 6)
  const products = recent.map((name: string) => allProducts.find((p: any) => p.name === name)).filter(Boolean)

  if (products.length < 2) return null

  return (
    <section className="bg-muted/30 py-10">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-6 text-xl font-bold text-foreground">Visto recientemente</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {products.map((p: any, i: number) => (
            <Link key={i} href={`/producto/${slugify(p.name)}`} className="flex-shrink-0 w-36 rounded-xl border border-border bg-surface p-3 transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="mb-2 aspect-square flex items-center justify-center bg-muted rounded-lg p-2">
                {p.imageUrl && <Image src={p.imageUrl} alt={p.name} width={200} height={200} className="h-full w-full object-contain" />}
              </div>
              <p className="text-xs font-medium text-foreground line-clamp-2">{p.name}</p>
              <p className="mt-1 text-sm font-bold text-primary">{p.price}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
