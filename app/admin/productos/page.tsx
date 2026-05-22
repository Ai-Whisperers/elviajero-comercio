"use client"
import { useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect, useCallback, useRef } from "react"
import { PageHeader, SearchInput } from "@/components/admin/ui"
import { ImageUpload } from "@/components/admin/image-upload"
import {
  Pencil, Copy, Trash2, Search, X, Plus, Package, Upload,
  ChevronLeft, ChevronRight, AlertCircle, Download, FileSpreadsheet,
  BarChart3, History, PackagePlus, TrendingUp, Layers,
} from "lucide-react"

function formatPrice(s: string) {
  const n = parseInt(s.replace(/[^0-9]/g, ""), 10)
  if (!n) return s
  return "Gs. " + n.toLocaleString("es-PY")
}

function parsePrice(s: string) {
  return parseInt((s || "0").replace(/[^0-9]/g, ""), 10) || 0
}

function calcMargin(price: string, cost: string) {
  const p = parsePrice(price)
  const c = parsePrice(cost)
  if (!p || !c) return null
  return Math.round(((p - c) / p) * 100)
}

function getAdminAccessToken() {
  if (typeof window === "undefined") return ""
  try {
    const stored = localStorage.getItem("elviajero_admin_session")
    if (stored) {
      const session = JSON.parse(stored)
      const accessToken = session?.access_token || session
      if (accessToken) {
        try {
          const payload = JSON.parse(atob(accessToken.split(".")[1] || ""))
          if (!payload?.exp || payload.exp * 1000 > Date.now() + 30_000) return accessToken
          localStorage.removeItem("elviajero_admin_session")
        } catch {
          return accessToken
        }
      }
    }
    const tokenCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("elviajero_admin_token="))
    return tokenCookie ? decodeURIComponent(tokenCookie.split("=").slice(1).join("=")) : ""
  } catch {
    return ""
  }
}

function adminHeaders(extra: Record<string, string> = {}) {
  const accessToken = getAdminAccessToken()
  return accessToken ? { ...extra, Authorization: `Bearer ${accessToken}` } : extra
}

async function adminFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const baseHeaders = init.headers instanceof Headers
    ? Object.fromEntries(init.headers.entries())
    : Array.isArray(init.headers)
      ? Object.fromEntries(init.headers)
      : (init.headers as Record<string, string> | undefined) || {}
  const first = await fetch(input, { ...init, headers: adminHeaders(baseHeaders) })
  if (first.status !== 401) return first

  // If an old tab has a stale bearer token, remove it and retry once using the
  // SSR Supabase cookie/session. This prevents false "Error al guardar" after
  // the local admin token expires while the page remains open.
  try { localStorage.removeItem("elviajero_admin_session") } catch {}
  return fetch(input, { ...init, headers: baseHeaders })
}

async function responseError(res: Response, fallback: string) {
  try {
    const data = await res.clone().json()
    return data?.error || data?.details || data?.hint || fallback
  } catch {
    return fallback
  }
}

export default function AdminProducts() {
  const { authed } = useAdminAuth()
  const [items, setItems] = useState<any[]>([])
  const [editing, setEditing] = useState<number | null>(null)
  const [form, setForm] = useState<any>({})
  const [showNew, setShowNew] = useState(false)
  const [newForm, setNewForm] = useState<any>({})
  const [showBulk, setShowBulk] = useState(false)
  const [bulkCategory, setBulkCategory] = useState("")
  const [bulkPercent, setBulkPercent] = useState(0)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [previewImg, setPreviewImg] = useState<string | null>(null)
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [importing, setImporting] = useState(false)
  const [showStockModal, setShowStockModal] = useState<number | null>(null)
  const [stockForm, setStockForm] = useState({ type: "add", quantity: 1, note: "" })
  const [priceHistory, setPriceHistory] = useState<any[] | null>(null)
  const [priceHistoryProduct, setPriceHistoryProduct] = useState<string>("")
  const fileRef = useRef<HTMLInputElement>(null)
  const PER_PAGE = 20
  const [categoryList, setCategoryList] = useState<string[]>([])
  const [subcategoryMap, setSubcategoryMap] = useState<Record<string, {name:string;slug:string}[]>>({})

  const notify = useCallback((type: "success" | "error", text: string) => {
    setNotification({ type, text })
    setTimeout(() => setNotification(null), 3000)
  }, [])

  const load = useCallback(() => {
    setLoading(true)
    adminFetch(`/api/admin/products?page=${page}&perPage=${PER_PAGE}`)
      .then(r => r.json())
      .then(res => { if (res.data) { setItems(res.data); setTotal(res.total) }; setLoading(false) })
      .catch(() => { setLoading(false); notify("error", "Error al cargar productos") })
  }, [page, notify])

  const loadSubcategories = useCallback(async () => {
    try {
      const res = await adminFetch("/api/home")
      const data = await res.json()
      const subs: Record<string, {name:string;slug:string}[]> = {}
      const raw = data?.categories || []
      for (const cat of raw) {
        const slug = cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "")
        if (cat.subcategories?.length) {
          subs[slug] = cat.subcategories
        }
      }
      setSubcategoryMap(subs)
    } catch {}
  }, [])

  const loadCategories = useCallback(() => {
    adminFetch("/api/admin/categories")
      .then(r => r.json())
      .then((data: any[]) => { setCategoryList((data || []).map((c: any) => c.name).filter(Boolean)) })
      .catch(() => {})
  }, [])

  useEffect(() => { if (authed) { load(); loadCategories(); loadSubcategories() } }, [authed, load, loadCategories, loadSubcategories])

  const save = async () => {
    if (editing === null) return
    const item = items[editing]
    const payload = { id: item.id, ...item, ...form }
    const res = await adminFetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    if (res.ok) {
      const saved = await res.json().catch(() => null)
      items[editing] = saved?.data ? { ...item, ...saved.data } : { ...item, ...form }
      setItems([...items])
      setEditing(null)
      notify("success", "Producto actualizado")
    } else {
      notify("error", await responseError(res, "Error al guardar"))
    }
  }

  const add = async () => {
    if (!newForm.name) return notify("error", "El nombre es obligatorio")
    const res = await adminFetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newForm)
    })
    if (res.ok) {
      const data = await res.json()
      setItems([data, ...items])
      setShowNew(false)
      setNewForm({})
      notify("success", "Producto creado")
    } else {
      notify("error", await responseError(res, "Error al crear producto"))
    }
  }

  const remove = async (id: string) => {
    if (!confirm("¿Eliminar este producto?")) return
    await adminFetch("/api/admin/products?id=" + id, { method: "DELETE" })
    setItems(items.filter(p => p.id !== id))
    notify("success", "Producto eliminado")
  }

  const duplicate = async (p: any) => {
    const { id, created_at, ...rest } = p
    rest.name = p.name + " (copia)"
    const res = await adminFetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rest)
    })
    if (res.ok) {
      const data = await res.json()
      setItems([data, ...items])
      notify("success", "Producto duplicado")
    } else {
      notify("error", await responseError(res, "Error al duplicar"))
    }
  }

  const applyBulk = async () => {
    if (!bulkCategory && !bulkPercent) return
    const target = bulkCategory ? items.filter(p => p.category === bulkCategory) : items
    for (const p of target) {
      const priceNum = parsePrice(p.price)
      const newPrice = Math.round(priceNum * (1 + bulkPercent / 100))
      await adminFetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: p.id, price: formatPrice(String(newPrice)) })
      })
    }
    load()
    setShowBulk(false)
    notify("success", `Precios actualizados (${target.length} productos)`)
  }

  const exportCsv = () => {
    window.open("/api/admin/products/export", "_blank")
    notify("success", "Descargando CSV...")
  }

  const importCsv = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true)
    const formData = new FormData()
    formData.append("file", file)
    const res = await adminFetch("/api/admin/products/import", { method: "POST", body: formData })
    const data = await res.json()
    setImporting(false)
    if (data.ok) {
      notify("success", data.message)
      load()
    } else {
      notify("error", data.error || "Error al importar")
    }
    if (fileRef.current) fileRef.current.value = ""
  }

  const handleStock = async (productId: number) => {
    const res = await adminFetch("/api/admin/stock-movements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId, ...stockForm })
    })
    const data = await res.json()
    if (data.ok) {
      notify("success", `Stock actualizado: ${data.stock_before} → ${data.stock_after}`)
      setShowStockModal(null)
      setStockForm({ type: "add", quantity: 1, note: "" })
      load()
    } else {
      notify("error", data.error || "Error al actualizar stock")
    }
  }

  const showPriceHistory = async (product: any) => {
    setPriceHistoryProduct(product.name)
    const res = await adminFetch(`/api/admin/products/price-history?product_id=${product.id}`)
    const data = await res.json()
    setPriceHistory(Array.isArray(data) ? data : [])
  }

  function getSubsForCategory(cat: string) {
    const slug = (cat || "").toLowerCase().replace(/[^a-z0-9]+/g, "")
    return subcategoryMap[slug] || []
  }

  const categories = [...new Set(items.map(p => p.category).filter(Boolean))].sort()
  const filtered = search
    ? items.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.toLowerCase().includes(search.toLowerCase()) ||
        p.brand?.toLowerCase().includes(search.toLowerCase())
      )
    : items

  if (!authed) return null

  return (
    <div className="space-y-5">
      {/* Notification toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-2xl border transition-all ${
          notification.type === "success"
            ? "bg-emerald-900/90 border-emerald-700/60 text-emerald-200"
            : "bg-red-900/90 border-red-700/60 text-red-200"
        }`}>
          {notification.type === "success" ? <Package className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {notification.text}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Productos</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {total} productos en total
            {search && ` · ${filtered.length} resultados`}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Export */}
          <button onClick={exportCsv}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700/60 px-3 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-600 transition-all">
            <Download className="w-3.5 h-3.5" />
            Exportar
          </button>
          {/* Import */}
          <button onClick={() => fileRef.current?.click()} disabled={importing}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700/60 px-3 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-600 transition-all disabled:opacity-50">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            {importing ? "Importando..." : "Importar"}
          </button>
          <input ref={fileRef} type="file" accept=".csv" onChange={importCsv} className="hidden" />
          {/* Bulk price */}
          <button onClick={() => setShowBulk(!showBulk)}
            className="rounded-lg border border-zinc-700/60 px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-600 transition-all">
            {showBulk ? "Cancelar" : "Actualización masiva"}
          </button>
          {/* New product */}
          <button onClick={() => setShowNew(!showNew)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition-all shadow-sm shadow-emerald-600/20">
            <Plus className="w-3.5 h-3.5" />
            {showNew ? "Cancelar" : "Nuevo producto"}
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
        <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
          placeholder="Buscar por nombre, categoría, marca..."
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 pl-9 pr-9 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Bulk price update panel */}
      {showBulk && (
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/70 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Upload className="w-4 h-4 text-emerald-400" />
            Actualización masiva de precios
          </h3>
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">Categoría</label>
              <select value={bulkCategory} onChange={e => setBulkCategory(e.target.value)}
                className="rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white border border-zinc-700/60 focus:outline-none focus:border-emerald-500/50">
                <option value="">Todas las categorías</option>
                {categoryList.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">Porcentaje</label>
              <div className="flex items-center gap-1">
                <input type="number" value={bulkPercent} onChange={e => setBulkPercent(parseInt(e.target.value) || 0)}
                  className="w-24 rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white border border-zinc-700/60 focus:outline-none focus:border-emerald-500/50" />
                <span className="text-sm text-zinc-500">{bulkPercent >= 0 ? "↑ aumento" : "↓ descuento"}</span>
              </div>
            </div>
            <button onClick={applyBulk}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition-all">Aplicar</button>
          </div>
        </div>
      )}

      {/* New product form */}
      {showNew && (
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/70 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white">Nuevo producto</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <input value={newForm.name || ""} onChange={e => setNewForm({...newForm, name: e.target.value})} placeholder="Nombre *"
              className="rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white border border-zinc-700/60 focus:outline-none focus:border-emerald-500/50" />
            <input value={newForm.price || ""} onChange={e => setNewForm({...newForm, price: e.target.value})} placeholder="Precio (Gs.)"
              className="rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white border border-zinc-700/60 focus:outline-none focus:border-emerald-500/50" />
            <input value={newForm.cost_price || ""} onChange={e => setNewForm({...newForm, cost_price: e.target.value})} placeholder="Costo (Gs.)"
              className="rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white border border-zinc-700/60 focus:outline-none focus:border-emerald-500/50" />
            <select value={newForm.category || ""} onChange={e => { setNewForm({...newForm, category: e.target.value, subcategory: ""}) }}
              className="rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white border border-zinc-700/60 focus:outline-none focus:border-emerald-500/50">
              <option value="">Categoría</option>
              {categoryList.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={newForm.subcategory || ""} onChange={e => setNewForm({...newForm, subcategory: e.target.value})}
              className="rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white border border-zinc-700/60 focus:outline-none focus:border-emerald-500/50">
              <option value="">Subcategoría</option>
              {getSubsForCategory(newForm.category).map(s => <option key={s.slug} value={s.name}>{s.name}</option>)}
            </select>
            <input value={newForm.b2b_price || ""} onChange={e => setNewForm({...newForm, b2b_price: e.target.value})} placeholder="Precio B2B (Gs.)"
              className="rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white border border-zinc-700/60 focus:outline-none focus:border-emerald-500/50" />
            <input type="number" value={newForm.stock ?? 0} onChange={e => setNewForm({...newForm, stock: parseInt(e.target.value) || 0})} placeholder="Stock"
              className="rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white border border-zinc-700/60 focus:outline-none focus:border-emerald-500/50" />
            <input type="number" value={newForm.stock_alert_threshold ?? 5} onChange={e => setNewForm({...newForm, stock_alert_threshold: parseInt(e.target.value) || 0})} placeholder="Umbral alerta"
              className="rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white border border-zinc-700/60 focus:outline-none focus:border-emerald-500/50" />
          </div>
          <textarea
            value={newForm.variants || ""}
            onChange={e => setNewForm({...newForm, variants: e.target.value})}
            placeholder='Variantes JSON opcional: [{"sku":"CAM-RED-M","color":"Rojo","size":"M","price":"Gs. 450000","stock":5}]'
            rows={2}
            className="w-full rounded-lg bg-zinc-800 px-3 py-2 text-xs text-white border border-zinc-700/60 focus:outline-none focus:border-emerald-500/50 font-mono"
          />
          <div className="flex items-center gap-3">
            <ImageUpload onUpload={(url) => setNewForm({...newForm, image_url: url})} />
            <button onClick={add}
              className="rounded-lg bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition-all">Guardar producto</button>
          </div>
        </div>
      )}

      {/* Image modal */}
      {previewImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setPreviewImg(null)}>
          <img src={previewImg} alt="" className="max-h-[80vh] max-w-[80vw] rounded-2xl border border-zinc-700/60 shadow-2xl" />
        </div>
      )}

      {/* Stock movement modal */}
      {showStockModal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowStockModal(null)}>
          <div className="bg-zinc-900 rounded-xl border border-zinc-700/60 p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-semibold text-white mb-4">Movimiento de stock</h3>
            <div className="space-y-3">
              <select value={stockForm.type} onChange={e => setStockForm({...stockForm, type: e.target.value})}
                className="w-full rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white border border-zinc-700/60 focus:outline-none focus:border-emerald-500/50">
                <option value="add">Ingreso</option>
                <option value="remove">Retiro</option>
                <option value="adjustment">Ajuste (cantidad = stock final)</option>
                <option value="return">Devolución</option>
              </select>
              <input type="number" value={stockForm.quantity} onChange={e => setStockForm({...stockForm, quantity: parseInt(e.target.value) || 0})}
                placeholder="Cantidad"
                className="w-full rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white border border-zinc-700/60 focus:outline-none focus:border-emerald-500/50" />
              <input value={stockForm.note} onChange={e => setStockForm({...stockForm, note: e.target.value})}
                placeholder="Nota / Referencia (ej: orden #123)"
                className="w-full rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white border border-zinc-700/60 focus:outline-none focus:border-emerald-500/50" />
              <div className="flex gap-2 pt-2">
                <button onClick={() => handleStock(showStockModal)}
                  className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition-all">Guardar</button>
                <button onClick={() => setShowStockModal(null)}
                  className="rounded-lg border border-zinc-700/60 px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white transition-all">Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Price history modal */}
      {priceHistory !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setPriceHistory(null)}>
          <div className="bg-zinc-900 rounded-xl border border-zinc-700/60 p-6 w-full max-w-xl mx-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Historial de precios: {priceHistoryProduct}</h3>
              <button onClick={() => setPriceHistory(null)} className="text-zinc-500 hover:text-white">✕</button>
            </div>
            {priceHistory.length === 0 ? (
              <p className="text-xs text-zinc-500">Sin cambios registrados</p>
            ) : (
              <div className="space-y-2">
                {priceHistory.map((h: any) => (
                  <div key={h.id} className="rounded-lg bg-zinc-800/50 p-3 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-zinc-400 font-medium">{h.field}</span>
                      <span className="text-zinc-600">{new Date(h.created_at).toLocaleString("es", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                    <div className="text-zinc-300">
                      {h.old_value || "—"} <span className="text-zinc-600">→</span> {h.new_value || "—"}
                    </div>
                    {h.reason && <div className="text-zinc-600 mt-1">Motivo: {h.reason}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Products table */}
      <div className="overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-900/30">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800/60 bg-zinc-900/80">
                <th className="w-12 px-3 py-3 text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Img</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Nombre</th>
                <th className="w-28 px-3 py-3 text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Precio</th>
                <th className="w-24 px-3 py-3 text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Costo</th>
                <th className="w-16 px-3 py-3 text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Margen</th>
                <th className="w-20 px-3 py-3 text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">B2B</th>
                <th className="w-24 px-3 py-3 text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Stock</th>
                <th className="w-28 px-3 py-3 text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Categoría</th>
                <th className="w-56 px-3 py-3 text-right text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-3 py-3"><div className="h-9 w-9 rounded-lg bg-zinc-800" /></td>
                    <td className="px-3 py-3"><div className="h-4 w-48 rounded bg-zinc-800" /></td>
                    <td className="px-3 py-3"><div className="h-4 w-20 rounded bg-zinc-800" /></td>
                    <td className="px-3 py-3"><div className="h-4 w-14 rounded bg-zinc-800" /></td>
                    <td className="px-3 py-3"><div className="h-4 w-10 rounded bg-zinc-800" /></td>
                    <td className="px-3 py-3"><div className="h-4 w-14 rounded bg-zinc-800" /></td>
                    <td className="px-3 py-3"><div className="h-4 w-16 rounded bg-zinc-800" /></td>
                    <td className="px-3 py-3"><div className="h-4 w-20 rounded bg-zinc-800" /></td>
                    <td className="px-3 py-3"><div className="h-4 w-40 rounded bg-zinc-800 ml-auto" /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-16 text-center">
                    <Package className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
                    <p className="text-sm text-zinc-500">
                      {search ? "No se encontraron productos con ese filtro" : "Sin productos todavía"}
                    </p>
                    {!search && (
                      <button onClick={() => setShowNew(true)}
                        className="mt-3 inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-all">
                        <Plus className="w-3 h-3" /> Crear primer producto
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filtered.map((p, i) => (
                  <tr key={p.id || i} className="group hover:bg-zinc-800/30 transition-colors">
                    {editing === i ? (
                      <>
                        <td className="px-3 py-2">
                          <ImageUpload onUpload={(url) => setForm({...form, image_url: url})} currentUrl={form.image_url || p.image_url} />
                        </td>
                        <td className="px-3 py-2">
                          <input value={form.name || p.name} onChange={e => setForm({...form, name: e.target.value})}
                            className="w-full rounded-lg bg-zinc-800 px-2.5 py-1.5 text-sm text-white border border-zinc-700/60 focus:outline-none focus:border-emerald-500/50" />
                        </td>
                        <td className="px-3 py-2">
                          <input value={form.price || p.price} onChange={e => setForm({...form, price: e.target.value})}
                            className="w-full rounded-lg bg-zinc-800 px-2.5 py-1.5 text-sm text-white border border-zinc-700/60 focus:outline-none focus:border-emerald-500/50" />
                        </td>
                        <td className="px-3 py-2">
                          <input value={form.cost_price ?? p.cost_price ?? ""} onChange={e => setForm({...form, cost_price: e.target.value})}
                            className="w-full rounded-lg bg-zinc-800 px-2.5 py-1.5 text-sm text-white border border-zinc-700/60 focus:outline-none focus:border-emerald-500/50" />
                        </td>
                        <td className="px-3 py-2 text-xs text-zinc-500">
                          {calcMargin(form.price || p.price, form.cost_price || p.cost_price) !== null
                            ? <span className={calcMargin(form.price || p.price, form.cost_price || p.cost_price)! >= 30 ? "text-emerald-400" : "text-amber-400"}>
                                {calcMargin(form.price || p.price, form.cost_price || p.cost_price)}%
                              </span>
                            : "—"}
                        </td>
                        <td className="px-3 py-2">
                          <input value={form.b2b_price ?? p.b2b_price ?? ""} onChange={e => setForm({...form, b2b_price: e.target.value})}
                            className="w-full rounded-lg bg-zinc-800 px-2.5 py-1.5 text-sm text-white border border-zinc-700/60 focus:outline-none focus:border-emerald-500/50" />
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <input type="number" value={form.stock ?? p.stock} onChange={e => setForm({...form, stock: parseInt(e.target.value) || 0})}
                              className="w-16 rounded-lg bg-zinc-800 px-2.5 py-1.5 text-sm text-white border border-zinc-700/60 focus:outline-none focus:border-emerald-500/50" />
                            <span className="text-zinc-600 text-[10px]">umbral</span>
                            <input type="number" value={form.stock_alert_threshold ?? p.stock_alert_threshold ?? 5} onChange={e => setForm({...form, stock_alert_threshold: parseInt(e.target.value) || 0})}
                              className="w-14 rounded-lg bg-zinc-800 px-2 py-1.5 text-xs text-white border border-zinc-700/60 focus:outline-none focus:border-emerald-500/50" />
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <div className="space-y-1.5">
                            <select value={form.category || p.category || ""} onChange={e => setForm({...form, category: e.target.value, subcategory: ""})}
                              className="w-full rounded-lg bg-zinc-800 px-2.5 py-1.5 text-sm text-white border border-zinc-700/60 focus:outline-none focus:border-emerald-500/50">
                              <option value="">—</option>
                              {categoryList.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <select value={form.subcategory ?? p.subcategory ?? ""} onChange={e => setForm({...form, subcategory: e.target.value})}
                              className="w-full rounded-lg bg-zinc-800 px-2.5 py-1.5 text-sm text-white border border-zinc-700/60 focus:outline-none focus:border-emerald-500/50">
                              <option value="">Subcategoría</option>
                              {getSubsForCategory(form.category || p.category).map(s => <option key={s.slug} value={s.name}>{s.name}</option>)}
                            </select>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-right">
                          <div className="space-y-2">
                            <textarea
                              value={form.variants || p.variants || ""}
                              onChange={e => setForm({...form, variants: e.target.value})}
                              placeholder='Variantes JSON'
                              rows={2}
                              className="w-full rounded-lg bg-zinc-800 px-2 py-1 text-[10px] text-white border border-zinc-700/60 focus:outline-none focus:border-emerald-500/50 font-mono"
                            />
                            <div className="inline-flex items-center gap-1.5">
                              <button onClick={save}
                                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 transition-all">Guardar</button>
                              <button onClick={() => setEditing(null)}
                                className="rounded-lg border border-zinc-700/60 px-3 py-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-all">Cancelar</button>
                            </div>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-3 py-2.5">
                          {p.image_url && !p.image_url.includes(".svg") ? (
                            <img src={p.image_url} alt=""
                              className="h-9 w-9 rounded-lg border border-zinc-700/40 object-cover cursor-pointer ring-1 ring-black/20 hover:ring-2 hover:ring-emerald-500/40 transition-all"
                              onClick={() => setPreviewImg(p.image_url)} />
                          ) : (
                            <div className="h-9 w-9 rounded-lg border border-zinc-700/40 bg-zinc-800/50 flex items-center justify-center">
                              <Package className="w-4 h-4 text-zinc-600" />
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="font-medium text-white text-sm leading-tight">{p.name || <span className="text-zinc-600 italic">Sin nombre</span>}</div>
                          {p.brand && <div className="text-[11px] text-zinc-500 mt-0.5">{p.brand}</div>}
                          {p.variants && (
                            <div className="mt-1">
                              <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                <Layers className="w-3 h-3" />
                                {Array.isArray(JSON.parse(p.variants)) ? JSON.parse(p.variants).length : "?"} variantes
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-2.5">
                          <span className="font-semibold text-white text-sm">{p.price || <span className="text-zinc-600">—</span>}</span>
                          {p.price_before && (
                            <span className="block text-[10px] text-zinc-600 line-through">{p.price_before}</span>
                          )}
                        </td>
                        <td className="px-3 py-2.5">
                          <span className="text-sm text-zinc-400">{p.cost_price || <span className="text-zinc-600">—</span>}</span>
                        </td>
                        <td className="px-3 py-2.5">
                          {(() => {
                            const m = calcMargin(p.price, p.cost_price)
                            return m !== null ? (
                              <span className={`text-xs font-medium ${m >= 30 ? "text-emerald-400" : m >= 10 ? "text-amber-400" : "text-red-400"}`}>
                                {m}%
                              </span>
                            ) : <span className="text-zinc-600 text-xs">—</span>
                          })()}
                        </td>
                        <td className="px-3 py-2.5">
                          <span className="text-xs text-zinc-400">{p.b2b_price || <span className="text-zinc-600">—</span>}</span>
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-1">
                            <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                              (p.stock || 0) > 10 ? "text-emerald-400" :
                              (p.stock || 0) > 0 ? "text-amber-400" :
                              "text-red-400"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                (p.stock || 0) > 10 ? "bg-emerald-400" :
                                (p.stock || 0) > 0 ? "bg-amber-400" :
                                "bg-red-400"
                              }`} />
                              {p.stock ?? 0}
                            </span>
                            <button onClick={() => { setShowStockModal(p.id); setStockForm({...stockForm, note: ""}) }}
                              className="p-1 text-zinc-600 hover:text-emerald-400 transition-colors" title="Movimiento de stock">
                              <PackagePlus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="flex flex-col gap-0.5">
                            <span className="inline-block rounded-md bg-zinc-800/60 px-2 py-0.5 text-[11px] font-medium text-zinc-400">
                              {p.category || <span className="text-zinc-600">—</span>}
                            </span>
                            {p.subcategory && (
                              <span className="inline-block rounded-md bg-zinc-800/30 px-2 py-0.5 text-[10px] font-medium text-zinc-500">
                                {p.subcategory}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          <div className="inline-flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => showPriceHistory(p)}
                              className="rounded-lg p-1.5 text-zinc-500 hover:text-purple-400 hover:bg-purple-500/10 transition-all"
                              title="Historial de precios">
                              <History className="w-4 h-4" />
                            </button>
                            <button onClick={() => { setForm({name: p.name, price: p.price, cost_price: p.cost_price || "", b2b_price: p.b2b_price || "", stock: p.stock, stock_alert_threshold: p.stock_alert_threshold ?? 5, category: p.category, subcategory: p.subcategory, image_url: p.image_url}); setEditing(i) }}
                              className="rounded-lg p-1.5 text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                              title="Editar producto">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => duplicate(p)}
                              className="rounded-lg p-1.5 text-zinc-500 hover:text-amber-400 hover:bg-amber-500/10 transition-all"
                              title="Duplicar producto">
                              <Copy className="w-4 h-4" />
                            </button>
                            <button onClick={() => remove(p.id)}
                              className="rounded-lg p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                              title="Eliminar producto">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {total > PER_PAGE && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-500 text-xs">
            {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, total)} de {total} productos
          </span>
          <div className="inline-flex items-center gap-1.5">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="inline-flex items-center gap-1 rounded-lg border border-zinc-700/60 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white hover:border-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <ChevronLeft className="w-3.5 h-3.5" /> Anterior
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.ceil(total / PER_PAGE) }, (_, i) => i + 1)
                .filter(p => p === 1 || p === Math.ceil(total / PER_PAGE) || Math.abs(p - page) <= 1)
                .map((p, idx, arr) => (
                  <span key={p} className="inline-flex items-center">
                    {idx > 0 && arr[idx-1] !== p - 1 && <span className="px-1 text-zinc-600 text-xs">…</span>}
                    <button onClick={() => setPage(p)}
                      className={`w-7 h-7 rounded-lg text-xs font-medium transition-all ${
                        p === page
                          ? "bg-emerald-600/20 text-emerald-400 border border-emerald-600/30"
                          : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
                      }`}>
                      {p}
                    </button>
                  </span>
                ))}
            </div>
            <button onClick={() => setPage(p => p + 1)} disabled={page * PER_PAGE >= total}
              className="inline-flex items-center gap-1 rounded-lg border border-zinc-700/60 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white hover:border-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              Siguiente <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
