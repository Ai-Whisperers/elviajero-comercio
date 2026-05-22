"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import content from "@/content/es.json"

const c = content as any
const allProducts = c.home?.productCatalog?.products || []

function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9\u00e1\u00e9\u00ed\u00f3\u00fa\u00f1\u00fc]+/g, "-").replace(/-+$/, "") }

export function SearchAutocomplete() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [focused, setFocused] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const timer = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setFocused(false) }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleChange = (value: string) => {
    setQuery(value)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      if (value.trim().length < 2) { setResults([]); return }
      const q = value.toLowerCase()
      setResults(allProducts.filter((p: any) => p.name.toLowerCase().includes(q) || (p.brand || "").toLowerCase().includes(q)).slice(0, 6))
    }, 250)
  }

  return (
    <div ref={ref} className="relative">
      <input type="text" value={query} onChange={e => handleChange(e.target.value)} onFocus={() => setFocused(true)}
        placeholder="Buscar productos..." className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-ring"
        aria-label="Buscar productos" autoComplete="off" />
      {query.length >= 2 && focused && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-80 overflow-y-auto rounded-xl border border-border bg-surface shadow-lg">
          {results.map((p: any, i: number) => (
            <Link key={i} href={"/producto/" + slugify(p.name)} onClick={() => { setQuery(""); setResults([]); setFocused(false) }}
              className="flex items-center gap-3 border-b border-border px-4 py-3 transition-colors hover:bg-muted last:border-0">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white">
                {p.imageUrl && <Image src={p.imageUrl} alt={p.name} width={40} height={40} className="h-full w-full object-contain p-1" />}
              </div>
              <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-foreground">{p.name}</p><p className="text-xs text-muted-foreground">{p.price}</p></div>
            </Link>
          ))}
        </div>
      )}
      {query.length >= 2 && focused && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-xl border border-border bg-surface p-4 text-center shadow-lg">
          <p className="text-sm text-muted-foreground">No se encontraron productos</p>
        </div>
      )}
    </div>
  )
}
