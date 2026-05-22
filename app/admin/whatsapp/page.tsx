"use client"
import { adminFetch } from "@/lib/admin-fetch"
import { useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"
import { PageHeader, EmptyState } from "@/components/admin/ui"

interface Template {
  id: string
  name: string
  trigger: "order_new" | "order_confirmed" | "order_shipped" | "order_delivered" | "stock_alert" | "abandoned_cart" | "custom"
  message: string
  active: boolean
  delay_minutes?: number
}

const defaultTemplates: Template[] = [
  { id: "tpl-1", name: "Nuevo pedido (admin)", trigger: "order_new", message: "🛒 Nuevo pedido #{order_id}\nCliente: {customer_name}\nTotal: {total}\n\nVer en admin: {admin_url}", active: true },
  { id: "tpl-2", name: "Pedido confirmado (cliente)", trigger: "order_confirmed", message: "¡Hola {customer_name}! ✅ Tu pedido #{order_id} fue confirmado.\nTotal: {total}\n\nTe avisamos cuando se despache.", active: true },
  { id: "tpl-3", name: "Pedido enviado (cliente)", trigger: "order_shipped", message: "🚚 ¡Tu pedido #{order_id} está en camino!\n\nGracias por elegir El Viajero 🎒", active: true },
  { id: "tpl-4", name: "Pedido entregado (cliente)", trigger: "order_delivered", message: "📦 ¡Pedido #{order_id} entregado!\n\nEsperamos que disfrutes tu compra. Dejanos una reseña en {review_url}", active: false },
  { id: "tpl-5", name: "Carrito abandonado", trigger: "abandoned_cart", message: "👋 ¡Hola {customer_name}!\nVimos que dejaste productos en tu carrito.\n\n¿Necesitás ayuda para completar tu compra?\n{checkout_url}", active: false, delay_minutes: 60 },
]

export default function WhatsAppTemplatesPage() {
  const { authed } = useAdminAuth()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<Template>>({})

  useEffect(() => {
    if (!authed) return
    adminFetch("/api/admin/whatsapp-templates")
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data) && data.length > 0 ? data : defaultTemplates
        setTemplates(list)
        setLoading(false)
      })
      .catch(() => {
        setTemplates(defaultTemplates)
        setLoading(false)
      })
  }, [authed])

  const save = async () => {
    const updated = templates.map(t => t.id === editing ? { ...t, ...form } as Template : t)
    await adminFetch("/api/admin/whatsapp-templates", {
      method: "POST",
      body: JSON.stringify(updated)
    })
    setTemplates(updated)
    setEditing(null)
  }

  const toggleActive = async (id: string) => {
    const updated = templates.map(t => t.id === id ? { ...t, active: !t.active } : t)
    await adminFetch("/api/admin/whatsapp-templates", {
      method: "POST",
      body: JSON.stringify(updated)
    })
    setTemplates(updated)
  }

  if (!authed) return null

  return (
    <>
      <PageHeader
        title="WhatsApp / Plantillas"
        subtitle={`${templates.filter(t => t.active).length} plantillas activas de ${templates.length}`}
      />

      {loading ? (
        <div className="animate-pulse space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-24 rounded-xl bg-zinc-800/50" />)}
        </div>
      ) : (
        <div className="space-y-4">
          {templates.map(t => (
            <div key={t.id} className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4">
              {editing === t.id ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <input
                      value={form.name || t.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="bg-zinc-800 border border-zinc-700/60 rounded-lg px-3 py-1.5 text-sm text-white w-full max-w-xs"
                    />
                    <div className="flex gap-2">
                      <button onClick={save} className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg">Guardar</button>
                      <button onClick={() => setEditing(null)} className="text-xs text-zinc-400 px-3 py-1.5">Cancelar</button>
                    </div>
                  </div>
                  <textarea
                    value={form.message || t.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    rows={4}
                    className="w-full bg-zinc-800 border border-zinc-700/60 rounded-lg px-3 py-2 text-sm text-white font-mono"
                  />
                  <div className="flex gap-4 text-xs text-zinc-500">
                    <label className="flex items-center gap-2">
                      Delay (min):
                      <input
                        type="number"
                        value={form.delay_minutes ?? t.delay_minutes ?? 0}
                        onChange={e => setForm({ ...form, delay_minutes: parseInt(e.target.value) || 0 })}
                        className="w-16 bg-zinc-800 border border-zinc-700/60 rounded px-2 py-1 text-white"
                      />
                    </label>
                    <span>Variables: {"{order_id} {customer_name} {total} {admin_url} {checkout_url} {review_url}"}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-white">{t.name}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${t.active ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-zinc-800 text-zinc-500 border-zinc-700/50"}`}>
                        {t.active ? "Activa" : "Inactiva"}
                      </span>
                      <span className="text-[10px] text-zinc-500 uppercase">{t.trigger}</span>
                    </div>
                    <p className="text-xs text-zinc-400 font-mono whitespace-pre-wrap">{t.message}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => toggleActive(t.id)} className="text-xs text-zinc-400 hover:text-white px-2 py-1">
                      {t.active ? "Desactivar" : "Activar"}
                    </button>
                    <button onClick={() => { setEditing(t.id); setForm({}) }} className="text-xs text-emerald-400 hover:text-emerald-300 px-2 py-1">
                      Editar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
