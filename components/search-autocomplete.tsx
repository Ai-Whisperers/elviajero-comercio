"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9áéíóúñü]+/g, "-").replace(/-+$/, "")
}

export function SearchAutocomplete() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [focused, setFocused] = useState(false)
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setFocused(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const searchProducts = useCallback(async (value: string) => {
    // Cancel previous request
    if (abortRef.current) abortRef.current.abort()
    if (value.trim().length < 2) { setResults([]); return }

    const controller = new AbortController()
    abortRef.current = controller
    setLoading(true)

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(value)}`, { signal: controller.signal })
      if (!controller.signal.aborted) {
        const data = await res.json()
        setResults(Array.isArray(data) ? data : [])
      }
    } catch {
      // aborted or network error — ignore
    } finally {
      if (!controller.signal.aborted) setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => searchProducts(query), 250)
    return () => clearTimeout(timer)
  }, [query, searchProducts])

  const handleSelect = () => {
    setQuery("")
    setResults([])
    setFocused(false)
  }

  const slug = (p: any) => p.slug || slugify(p.name)

  return (
    <div ref={ref} className="relative">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        placeholder="Buscar productos..."
        className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-ring"
        aria-label="Buscar productos"
        autoComplete="off"
      />
      {query.length >= 2 && focused && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-80 overflow-y-auto rounded-xl border border-border bg-surface shadow-lg">
          {loading && (
            <div className="px-4 py-3 text-center">
              <p className="text-sm text-muted-foreground">Buscando...</p>
            </div>
          )}
          {!loading && results.length > 0 && results.map((p: any) => (
            <Link
              key={p.id || p.name}
              href={`/producto/${slug(p)}`}
              onClick={handleSelect}
              className="flex items-center gap-3 border-b border-border px-4 py-3 transition-colors hover:bg-muted last:border-0"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white">
                {p.image_url && <Image src={p.image_url} alt={p.name} width={40} height={40} className="h-full w-full object-contain p-1" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.category} · {p.price}</p>
              </div>
            </Link>
          ))}
          {!loading && results.length === 0 && (
            <div className="p-4 text-center">
              <p className="text-sm text-muted-foreground">No se encontraron productos</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
