"use client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CookieConsent } from "@/components/cookie-consent"
import { Breadcrumbs } from "@/components/ui"
import { useState, useEffect } from "react"

export default function AdminProductosPage() {
  const [products, setProducts] = useState<any[]>([])
  const [editing, setEditing] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<any>({})

  useEffect(() => {
    fetch("/api/products").then(r => r.json()).then(setProducts).catch(() => {})
  }, [])

  const saveEdit = async (name: string) => {
    await fetch("/api/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, updates: editValues })
    })
    setEditing(null)
    // Refresh
    const res = await fetch("/api/products")
    const data = await res.json()
    setProducts(data)
  }

  const formatGs = (n: number) => "Gs. " + (n || 0).toLocaleString("es-PY")

  return (
    <>
      <Header />
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Admin", href: "/admin" }, { label: "Productos" }]} />
      <section className="bg-background py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-3xl font-bold text-foreground mb-8">Gestión de Productos</h1>

          {products.length === 0 && <p className="text-muted-foreground">Cargando...</p>}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-3 pr-4 font-medium">Producto</th>
                  <th className="pb-3 pr-4 font-medium">Precio</th>
                  <th className="pb-3 pr-4 font-medium">Stock</th>
                  <th className="pb-3 pr-4 font-medium">Categoría</th>
                  <th className="pb-3 font-medium">Acción</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p: any) => (
                  <tr key={p.name} className="border-b border-border">
                    {editing === p.name ? (
                      <>
                        <td className="py-3 pr-4"><input defaultValue={p.name} className="w-full rounded border px-2 py-1 text-xs" onChange={e => setEditValues({...editValues, name: e.target.value})} /></td>
                        <td className="py-3 pr-4"><input defaultValue={p.price} className="w-24 rounded border px-2 py-1 text-xs" onChange={e => setEditValues({...editValues, price: e.target.value})} /></td>
                        <td className="py-3 pr-4"><input type="number" defaultValue={p.stock} className="w-16 rounded border px-2 py-1 text-xs" onChange={e => setEditValues({...editValues, stock: parseInt(e.target.value) || 0})} /></td>
                        <td className="py-3 pr-4 text-muted-foreground">{p.category}</td>
                        <td className="py-3">
                          <button onClick={() => saveEdit(p.name)} className="text-green-600 hover:underline text-xs mr-3">Guardar</button>
                          <button onClick={() => setEditing(null)} className="text-muted-foreground hover:underline text-xs">Cancelar</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 pr-4 font-medium text-foreground">{p.name}</td>
                        <td className="py-3 pr-4 font-semibold">{p.price}</td>
                        <td className="py-3 pr-4">
                          <span className={`${(p.stock ?? 0) === 0 ? "text-destructive" : p.stock <= 3 ? "text-warning" : "text-green-600"} font-medium`}>
                            {p.stock ?? 0}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-muted-foreground">{p.category}</td>
                        <td className="py-3">
                          <button onClick={() => { setEditing(p.name); setEditValues({...p}) }} className="text-primary hover:underline text-xs">Editar</button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 rounded-xl border border-border bg-surface p-4 text-sm">
            <p className="font-medium text-foreground mb-2">📝 Instrucciones</p>
            <p className="text-xs text-muted-foreground">Hacé clic en "Editar" para cambiar precio o stock. Los cambios se guardan automáticamente en el sitio. Para agregar productos nuevos, editá el archivo content/es.json directamente (próximamente disponible desde acá).</p>
          </div>
        </div>
      </section>
      <Footer />
      <CookieConsent />
    </>
  )
}
