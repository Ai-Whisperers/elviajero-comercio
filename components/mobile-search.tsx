
"use client"
import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import content from "@/content/es.json"

const c = content as any
const allProducts = c.home?.productCatalog?.products || []

function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9áéíóúñü]+/g, "-").replace(/-+$/, "") }

export function MobileSearchBar() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const timer = useRef<NodeJS.Timeout | undefined>(undefined)

  const handleChange = (value: string) => {
    setQuery(value)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      if (value.trim().length < 2) { setResults([]); return }
      const q = value.toLowerCase()
      setResults(allProducts.filter((p: any) => p.name.toLowerCase().includes(q)).slice(0, 5))
    }, 250)
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-light md:hidden" aria-label="Buscar">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background md:hidden">
          <div className="flex items-center gap-3 border-b border-border p-4">
            <input autoFocus type="text" value={query} onChange={e => handleChange(e.target.value)}
              placeholder="Buscar productos..." className="flex-1 rounded-lg border border-input bg-surface px-4 py-3 text-sm outline-none focus:border-ring" />
            <button onClick={() => { setOpen(false); setQuery(""); setResults([]) }} className="text-sm text-muted-foreground">Cancelar</button>
          </div>
          {results.length > 0 && (
            <div className="flex-1 overflow-y-auto p-4">
              {results.map((p: any, i: number) => (
                <Link key={i} href={"/producto/" + slugify(p.name)} onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl border border-border p-3 mb-2 transition-all hover:bg-muted">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white">
                    {p.imageUrl && <Image src={p.imageUrl} alt={p.name} width={48} height={48} className="h-full w-full object-contain p-1" />}
                  </div>
                  <div><p className="font-medium text-foreground">{p.name}</p><p className="text-sm text-muted-foreground">{p.price}</p></div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
