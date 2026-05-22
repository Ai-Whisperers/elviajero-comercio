"use client"
import { useRecentlyViewed } from "@/lib/wishlist"
import Link from "next/link"
import Image from "next/image"
import content from "@/content/es.json"
const c = content as any
const all = c.home?.productCatalog?.products || []
function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9\u00e1\u00e9\u00ed\u00f3\u00fa\u00f1\u00fc]+/g, "-").replace(/-+$/, "") }
export function EmptyCartSuggestions() {
  const { items } = useRecentlyViewed()
  const prods = items.map(n => all.find((p: any) => p.name === n)).filter(Boolean).slice(0, 3)
  if (prods.length === 0) return null
  return (
    <div className="px-4 py-4">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Visto recientemente</p>
      <div className="space-y-2">
        {prods.map((p: any, i: number) => (
          <Link key={i} href={"/producto/" + slugify(p.name)} className="flex items-center gap-3 rounded-lg border border-border p-2 transition-all hover:bg-muted">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white">
              {p.imageUrl && <Image src={p.imageUrl} alt={p.name} width={40} height={40} className="h-full w-full object-contain p-1" />}
            </div>
            <div className="min-w-0 flex-1"><p className="truncate text-xs font-medium text-foreground">{p.name}</p><p className="text-xs text-primary font-bold">{p.price}</p></div>
          </Link>
        ))}
      </div>
    </div>
  )
}
