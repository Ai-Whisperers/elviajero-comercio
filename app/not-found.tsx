"use client"
import Link from "next/link"
import { useState } from "react"
import content from "@/content/es.json"

const c = content as any
const categories = c.home?.productCatalog?.categories || []

export default function NotFound() {
  const [search, setSearch] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) window.location.href = `/tienda?q=${encodeURIComponent(search.trim())}`
  }

  return (
    <>
<section className="flex min-h-[70vh] flex-col items-center justify-center bg-background px-4 py-20">
        <div className="max-w-lg text-center">
          <div className="text-8xl font-bold text-primary/20 mb-4">404</div>
          <div className="text-6xl mb-6">🔍</div>
          <h1 className="text-3xl font-bold text-foreground mb-3">Página no encontrada</h1>
          <p className="text-muted-foreground mb-8">La página que buscás no existe o fue movida. Buscá lo que necesitás:</p>
          <form onSubmit={handleSearch} className="mx-auto flex max-w-sm gap-2 mb-10">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscá productos..." className="flex-1 rounded-lg border border-input bg-surface px-4 py-3 text-sm outline-none focus:border-ring" />
            <button type="submit" className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Buscar</button>
          </form>
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat: string) => (
              <Link key={cat} href={`/categoria/${cat.toLowerCase().replace(/[^a-z]/g, "")}`}
                className="rounded-full border border-border bg-surface px-4 py-2 text-xs font-medium text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
                {cat}
              </Link>
            ))}
          </div>
          <Link href="/" className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-8 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all">
            Volver al inicio
          </Link>
        </div>
      </section>
</>
  )
}
