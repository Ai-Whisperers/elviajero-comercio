"use client"
import { useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
// Content provided by consumer app

const c = {} as any
const allProducts = c.home?.productCatalog?.products || []

function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9áéíóúñü]+/g, "-").replace(/-+$/, "") }

export function FrequentlyBought({ currentProduct }: { currentProduct: string }) {
  const pairs = useMemo(() => {
    // Try to get from order history
    const users = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("viajero_users") || "[]") : []
    const boughtWith: Record<string, number> = {}
    users.forEach((u: any) => {
      const ords = JSON.parse(localStorage.getItem("viajero_orders_" + u.id) || "[]")
      ords.forEach((o: any) => {
        const names = o.items?.map((i: any) => i.name) || []
        if (names.includes(currentProduct)) {
          names.forEach((n: string) => { if (n !== currentProduct) boughtWith[n] = (boughtWith[n] || 0) + 1 })
        }
      })
    })
    const sorted = Object.entries(boughtWith).sort((a, b) => b[1] - a[1]).slice(0, 3)
    return sorted.map(([name]) => allProducts.find((p: any) => p.name === name)).filter(Boolean)
  }, [currentProduct])

  if (pairs.length < 1) return null

  return (
    <div className="mt-8">
      <h3 className="mb-4 text-lg font-bold text-foreground">Comprados juntos frecuentemente</h3>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {pairs.map((p: any, i: number) => (
          <Link key={i} href={"/producto/" + slugify(p.name)} className="flex-shrink-0 w-36 rounded-xl border border-border bg-surface p-3 transition-all hover:-translate-y-1 hover:shadow-md">
            <div className="mb-2 aspect-square flex items-center justify-center bg-muted rounded-lg p-2">
              {p.imageUrl && <Image src={p.imageUrl} alt={p.name} width={200} height={200} className="h-full w-full object-contain" />}
            </div>
            <p className="text-xs font-medium text-foreground line-clamp-2">{p.name}</p>
            <p className="mt-1 text-sm font-bold text-primary">{p.price}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}