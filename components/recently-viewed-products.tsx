"use client"
import { useRecentlyViewed } from "@/lib/wishlist"
import Link from "next/link"
import Image from "next/image"
import content from "@/content/es.json"

const c = content as any
const allProducts = c.home?.productCatalog?.products || []

function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9\u00e1\u00e9\u00ed\u00f3\u00fa\u00f1\u00fc]+/g, "-").replace(/-+$/, "") }

export function RecentlyViewedProducts({ exclude }: { exclude: string }) {
  const { items } = useRecentlyViewed()
  const recent = items.filter(n => n !== exclude).slice(0, 4)
  const products = recent.map(name => allProducts.find((p: any) => p.name === name)).filter(Boolean)
  if (products.length < 2) return null
  return (
    <section className="mt-12">
      <h2 className="mb-4 text-xl font-bold text-foreground">Visto recientemente</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {products.map((p: any, i: number) => (
          <Link key={i} href={"/producto/" + slugify(p.name)} className="group rounded-xl border border-border bg-surface p-3 transition-all hover:-translate-y-1 hover:shadow-md">
            <div className="mb-2 aspect-square flex items-center justify-center bg-muted rounded-lg p-2">
              {p.imageUrl && <Image src={p.imageUrl} alt={p.name} width={200} height={200} className="h-full w-full object-contain" />}
            </div>
            <p className="text-xs font-medium text-foreground line-clamp-2 group-hover:text-primary">{p.name}</p>
            <p className="mt-1 text-sm font-bold text-primary">{p.price}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
