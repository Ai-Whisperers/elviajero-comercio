"use client"
import { useState, useRef, useCallback, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9áéíóúñü]+/g, "-").replace(/-+$/, "")
}

export function MobileSearchBar() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const searchProducts = useCallback(async (value: string) => {
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
      // aborted — ignore
    } finally {
      if (!controller.signal.aborted) setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (query.length < 2) return
    const timer = setTimeout(() => searchProducts(query), 250)
    return () => clearTimeout(timer)
  }, [query, searchProducts])

  const handleClose = () => {
    setOpen(false)
    setQuery("")
    setResults([])
  }

  const slug = (p: any) => p.slug || slugify(p.name)

  return (
    <>
      <button onClick={() => setOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-light md:hidden" aria-label="Buscar">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background md:hidden">
          <div className="flex items-center gap-3 border-b border-border p-4">
            <input autoFocus type="text" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Buscar productos..." className="flex-1 rounded-lg border border-input bg-surface px-4 py-3 text-sm outline-none focus:border-ring" />
            <button onClick={handleClose} className="text-sm text-muted-foreground">Cancelar</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {loading && <p className="text-center text-sm text-muted-foreground py-4">Buscando...</p>}
            {!loading && results.length > 0 && results.map((p: any) => (
              <Link key={p.id || p.name} href={`/producto/${slug(p)}`} onClick={handleClose}
                className="flex items-center gap-3 rounded-xl border border-border p-3 mb-2 transition-all hover:bg-muted">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white">
                  {p.image_url && <Image src={p.image_url} alt={p.name} width={48} height={48} className="h-full w-full object-contain p-1" />}
                </div>
                <div>
                  <p className="font-medium text-foreground">{p.name}</p>
                  <p className="text-sm text-muted-foreground">{p.category} · {p.price}</p>
                </div>
              </Link>
            ))}
            {!loading && query.length >= 2 && results.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-4">No se encontraron productos</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
