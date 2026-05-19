"use client"
import { useState, useEffect } from "react"
import { useAdminAuth } from "@/components/admin/admin-layout"
import { useToast } from "@/hooks/use-toast"
import { PageHeader, EmptyState, CardSkeleton } from "@/components/admin/ui"

export default function AdminPhotos() {
  const { authed } = useAdminAuth()
  const { toasts, addToast } = useToast()
  const [products, setProducts] = useState<any[]>([])
  const [uploading, setUploading] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authed) return
    setLoading(true)
    fetch("/api/admin/products").then(r => r.json()).then(data => {
      if (data) setProducts(data.map((p: any) => ({ id: p.id, name: p.name, image_url: p.image_url })))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [authed])

  const upload = async (productId: string, file: File) => {
    setUploading(productId)
    const form = new FormData()
    form.append("file", file)
    form.append("path", `products/${productId}`)

    const res = await fetch("/api/upload-image", { method: "POST", body: form })
    const data = await res.json()
    if (!res.ok) {
      addToast("error", "Error: " + (data.error || "Upload failed"))
      setUploading(null)
      return
    }

    await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: productId, image_url: data.url }),
    })
    setProducts(products.map(p => p.id === productId ? { ...p, image_url: data.url } : p))
    addToast("success", "Foto subida correctamente")
    setUploading(null)
  }

  if (!authed) return null

  return (
    <>
      <PageHeader
        title="Fotos de Productos"
        subtitle="Subí fotos reales para reemplazar los placeholders SVG"
      />

      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(t => (
          <div key={t.id} className={`rounded-lg px-4 py-3 text-sm font-medium shadow-lg border ${
            t.type === "success" ? "bg-emerald-900/90 border-emerald-700/60 text-emerald-200" :
            t.type === "error" ? "bg-red-900/90 border-red-700/60 text-red-200" :
            "bg-zinc-900/90 border-zinc-700/60 text-zinc-200"
          }`}>
            {t.message}
          </div>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
          title="Sin productos"
          description="Importá productos primero para poder subir fotos"
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((p) => (
            <div key={p.id} className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 overflow-hidden hover:border-zinc-700/60 transition-all">
              <div className="aspect-square bg-zinc-800 flex items-center justify-center relative">
                {p.image_url && !p.image_url.includes(".svg") ? (
                  <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-zinc-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
                    </svg>
                    <span className="text-xs">Sin foto</span>
                  </div>
                )}
                {uploading === p.id && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-white truncate">{p.name}</p>
                <label className="mt-2 flex cursor-pointer items-center justify-center rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors">
                  {uploading === p.id ? "Subiendo..." : "Elegir foto"}
                  <input type="file" accept="image/*" className="hidden" disabled={uploading !== null}
                    onChange={e => { const f = e.target.files?.[0]; if (f) upload(p.id, f); e.target.value = "" }} />
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
