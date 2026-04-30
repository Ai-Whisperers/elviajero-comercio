"use client"
import Link from "next/link"
import Image from "next/image"
import content from "@/content/es.json"

const c = content as any
const allProducts = c.home?.productCatalog?.products || []

function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9\u00e1\u00e9\u00ed\u00f3\u00fa\u00f1\u00fc]+/g, "-").replace(/-+$/, "") }

export function CartRelatedProducts({ currentItems }: { currentItems: string[] }) {
  if (currentItems.length === 0) return null

  // Find products in same categories as cart items
  const cats = currentItems.map(name => {
    const p = allProducts.find((x: any) => x.name === name)
    return p?.category || ""
  }).filter(Boolean)

  const related = allProducts
    .filter((p: any) => !currentItems.includes(p.name) && cats.includes(p.category))
    .slice(0, 4)

  if (related.length === 0) return null

  return (
    <div className="border-t border-border px-4 py-4">
      <p className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tambi\u00e9n te puede interesar</p>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {related.map((p: any, i: number) => (
          <Link key={i} href={"/producto/" + slugify(p.name)} className="flex-shrink-0 w-28">
            <div className="mb-1 flex h-20 w-28 items-center justify-center rounded-lg bg-muted p-2">
              {p.imageUrl && <Image src={p.imageUrl} alt={p.name} width={80} height={80} className="h-full w-full object-contain" />}
            </div>
            <p className="text-[10px] text-foreground line-clamp-2">{p.name}</p>
            <p className="text-xs font-bold text-primary mt-0.5">{p.price}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
