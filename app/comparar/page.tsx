"use client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CookieConsent } from "@/components/cookie-consent"
import { Breadcrumbs } from "@/components/ui"
import content from "@/content/es.json"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"

const c = content as any
const allProducts = c.home?.productCatalog?.products || []

export default function CompararPage() {
  const [selected, setSelected] = useState<string[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const ids = params.get("ids")
      if (ids) setSelected(ids.split(","))
    } catch {}
  }, [])

  const toggleProduct = (name: string) => {
    setSelected(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name].slice(0, 4))
  }

  const compareProducts = allProducts.filter((p: any) => selected.includes(p.name))

  return (
    <>
      <Header />
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Comparar Productos" }]} />
      <section className="bg-background py-12">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="text-3xl font-bold text-foreground mb-8">Comparar Productos</h1>

          {/* Search selector */}
          <div className="mb-8">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscá productos para comparar..."
              className="w-full max-w-md rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-ring"
            />
            {search && (
              <div className="mt-2 flex flex-wrap gap-2">
                {allProducts.filter((p: any) => p.name.toLowerCase().includes(search.toLowerCase()) && !selected.includes(p.name)).slice(0, 6).map((p: any) => (
                  <button key={p.name} onClick={() => { toggleProduct(p.name); setSearch("") }}
                    className="rounded-full bg-surface border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                    + {p.name}
                  </button>
                ))}
              </div>
            )}
            {selected.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selected.map(name => (
                  <button key={name} onClick={() => toggleProduct(name)} className="rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
                    {name} ✕
                  </button>
                ))}
              </div>
            )}
          </div>

          {compareProducts.length === 0 && (
            <div className="py-20 text-center">
              <span className="text-5xl block mb-4">⚖️</span>
              <p className="text-muted-foreground">Seleccioná productos para comparar (máx. 4).</p>
            </div>
          )}

          {compareProducts.length >= 2 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-3 pr-6 text-left text-muted-foreground font-medium w-40">Producto</th>
                    {compareProducts.map((p: any) => {
                      const slug = p.name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-")
                      return (
                        <th key={p.name} className="py-3 px-4 text-left">
                          <Link href={`/producto/${slug}`} className="block">
                            <div className="h-24 w-24 rounded-lg bg-muted p-2 mb-2 flex items-center justify-center mx-auto">
                              {p.imageUrl && <Image src={p.imageUrl} alt={p.name} width={96} height={96} className="h-full w-full object-contain" />}
                            </div>
                            <p className="font-semibold text-foreground text-xs text-center hover:text-primary line-clamp-2">{p.name}</p>
                          </Link>
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border"><td className="py-3 pr-6 font-medium text-muted-foreground">Precio</td>{compareProducts.map((p: any) => <td key={p.name} className="py-3 px-4"><span className="text-lg font-bold text-primary">{p.price}</span>{p.priceBefore && <span className="text-xs text-muted-foreground line-through ml-1">{p.priceBefore}</span>}</td>)}</tr>
                  <tr className="border-b border-border"><td className="py-3 pr-6 font-medium text-muted-foreground">Marca</td>{compareProducts.map((p: any) => <td key={p.name} className="py-3 px-4 text-foreground">{p.brand || "—"}</td>)}</tr>
                  <tr className="border-b border-border"><td className="py-3 pr-6 font-medium text-muted-foreground">Categoría</td>{compareProducts.map((p: any) => <td key={p.name} className="py-3 px-4 text-foreground">{p.category}</td>)}</tr>
                  <tr className="border-b border-border"><td className="py-3 pr-6 font-medium text-muted-foreground">Stock</td>{compareProducts.map((p: any) => <td key={p.name} className="py-3 px-4">{p.stock > 0 ? <span className="text-green-600">En stock</span> : <span className="text-destructive">Agotado</span>}</td>)}</tr>
                  <tr className="border-b border-border"><td className="py-3 pr-6 font-medium text-muted-foreground">Especificaciones</td>{compareProducts.map((p: any) => <td key={p.name} className="py-3 px-4 text-xs text-foreground">{p.specs || "—"}</td>)}</tr>
                  <tr className="border-b border-border"><td className="py-3 pr-6 font-medium text-muted-foreground">Peso</td>{compareProducts.map((p: any) => <td key={p.name} className="py-3 px-4 text-foreground">{p.weight || "—"}</td>)}</tr>
                  <tr><td className="py-3 pr-6 font-medium text-muted-foreground">Descripción</td>{compareProducts.map((p: any) => <td key={p.name} className="py-3 px-4 text-xs text-muted-foreground">{p.description || "—"}</td>)}</tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
      <Footer />
      <CookieConsent />
    </>
  )
}
