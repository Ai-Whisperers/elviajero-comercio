"use client"

import { useRecentlyViewed } from "@/lib/wishlist"
import { SafeImage } from "@/components/safe-image"
import Link from "next/link"
import content from "@/content/es.json"

const c = content as any
const allProducts = c.home?.productCatalog?.products || []

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9áéíóúñü]+/g, "-").replace(/-+$/, "")
}

export function RecentlyViewedProducts({ exclude }: { exclude: string }) {
  const { items } = useRecentlyViewed()
  const recent = items.filter((n) => n !== exclude).slice(0, 4)
  const products = recent.map((name) => allProducts.find((p: any) => p.name === name)).filter(Boolean)
  if (products.length < 2) return null

  return (
    <section className="mt-12">
      <h2 className="mb-4 text-xl font-bold text-foreground">Visto recientemente</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {products.map((p: any, i: number) => (
          <Link
            key={i}
            href={`/producto/${slugify(p.name)}`}
            className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-all hover:-translate-y-1 hover:shadow-md"
          >
            <div className="relative aspect-square overflow-hidden bg-muted">
              {p.imageUrl ? (
                <SafeImage
                  src={p.imageUrl}
                  alt={p.name}
                  width={200}
                  height={200}
                  containerClassName="h-full w-full"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-muted-foreground/25">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="M21 15l-5-5L5 21"/>
                  </svg>
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-1 p-3">
              <p className="text-xs font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                {p.name}
              </p>
              <div className="mt-auto flex items-baseline gap-1.5 pt-1">
                <p className="text-sm font-bold text-foreground">{p.price}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
