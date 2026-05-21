"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import content from "@/content/es.json"

const c = content as any
const allProducts = c.home?.productCatalog?.products || []

const KEY = "viajero_compare"

export default function ComparePage() {
  const [items, setItems] = useState<any[]>([])
  const [clearMsg, setClearMsg] = useState("")

  useEffect(() => {
    const names: string[] = JSON.parse(localStorage.getItem(KEY) || "[]")
    setItems(names.map(n => allProducts.find((p: any) => p.name === n)).filter(Boolean))
  }, [])

  const remove = (name: string) => {
    const names: string[] = JSON.parse(localStorage.getItem(KEY) || "[]")
    const updated = names.filter(n => n !== name)
    localStorage.setItem(KEY, JSON.stringify(updated))
    setItems(prev => prev.filter((p: any) => p.name !== name))
  }

  const clearAll = () => {
    localStorage.removeItem(KEY)
    setItems([])
    setClearMsg("Lista de comparación vaciada")
    setTimeout(() => setClearMsg(""), 3000)
  }

  const fields = ["price", "brand", "category", "specs", "weight", "stock"]

  return (
    <>
<section className="min-h-[70vh] bg-background pb-20 pt-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Comparar productos</h1>
            {items.length > 0 && <button onClick={clearAll} className="text-sm text-destructive hover:underline">Vaciar lista</button>}
          </div>
          {clearMsg && <div className="mb-4 rounded-lg bg-success/10 p-3 text-sm text-success">{clearMsg}</div>}

          {items.length === 0 ? (
            <div className="rounded-xl border border-border bg-surface p-12 text-center">
              <div className="text-5xl mb-4">⚖️</div>
              <p className="text-lg text-foreground mb-2">No hay productos para comparar</p>
              <p className="text-sm text-muted-foreground mb-6">Hacé clic en "Comparar" en los productos de la tienda</p>
              <Link href="/tienda" className="inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground">Ir a la tienda</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="w-40 px-4 py-3 text-left text-muted-foreground font-medium"></th>
                    {items.map((p: any, i: number) => (
                      <th key={i} className="px-4 py-3 text-center min-w-[180px]">
                        <button onClick={() => remove(p.name)} className="float-right text-xs text-destructive hover:underline">✕</button>
                        <div className="flex flex-col items-center">
                          <div className="mb-2 h-24 w-24 flex items-center justify-center bg-muted rounded-lg p-2">
                            {p.imageUrl && <Image src={p.imageUrl} alt={p.name} width={96} height={96} className="h-full w-full object-contain" />}
                          </div>
                          <p className="font-semibold text-foreground">{p.name}</p>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {fields.map(f => (
                    <tr key={f}>
                      <td className="px-4 py-3 font-medium text-muted-foreground capitalize">{f === "price" ? "Precio" : f === "brand" ? "Marca" : f === "category" ? "Categoría" : f === "specs" ? "Especificaciones" : f === "weight" ? "Peso" : "Stock"}</td>
                      {items.map((p: any, i: number) => (
                        <td key={i} className="px-4 py-3 text-center text-foreground">
                          {f === "price" ? <span className="text-lg font-bold text-primary">{p.price}</span> :
                           f === "stock" ? (p.stock > 0 ? <span className="text-success">En stock</span> : <span className="text-destructive">Agotado</span>) :
                           (p[f] || "—")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
</>
  )
}
