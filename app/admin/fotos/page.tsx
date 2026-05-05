"use client"
import { useState, useRef } from "react"
import { AdminShell, useAdminAuth } from "@/components/admin/admin-layout"

export default function AdminPhotos() {
  const { authed } = useAdminAuth()
  const [products, setProducts] = useState<any[]>([])
  const [uploading, setUploading] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useState(() => {
    if (!authed) return
    fetch("/api/admin/products").then(r => r.json()).then(data => {
      if (data) setProducts(data.map((p: any) => ({ id: p.id, name: p.name, image_url: p.image_url })))
    })
  })

  const upload = async (productId: string, file: File) => {
    setUploading(productId)
    const ext = file.name.split(".").pop()
    const fileName = `products/${productId}-${Date.now()}.${ext}`
    const { createClient } = await import("@/lib/supabase/client")
    const supabase = createClient()

    const { error } = await supabase.storage.from("ej_images").upload(fileName, file)
    if (error) { alert("Error: " + error.message); setUploading(null); return }

    const { data: { publicUrl } } = supabase.storage.from("ej_images").getPublicUrl(fileName)
    await fetch("/api/admin/products", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: productId, image_url: publicUrl }) })
    setProducts(products.map(p => p.id === productId ? { ...p, image_url: publicUrl } : p))
    setUploading(null)
  }

  if (!authed) return null

  return (
    <>
      <h1 className="mb-6 text-xl font-bold text-white">Fotos de Productos</h1>
      <p className="mb-6 text-sm text-gray-400">Subí fotos reales para reemplazar los placeholders SVG. Clickeá en cada producto para elegir una imagen.</p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((p) => (
          <div key={p.id} className="rounded-xl border border-gray-800 bg-gray-900 overflow-hidden">
            <div className="aspect-square bg-gray-800 flex items-center justify-center relative">
              {p.image_url && !p.image_url.includes(".svg") ? (
                <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-500">
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
              <label className="mt-2 flex cursor-pointer items-center justify-center rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-500 transition-colors">
                {uploading === p.id ? "Subiendo..." : "Elegir foto"}
                <input type="file" accept="image/*" className="hidden" disabled={uploading !== null}
                  onChange={e => { const f = e.target.files?.[0]; if (f) upload(p.id, f); e.target.value = "" }} />
              </label>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
