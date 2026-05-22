"use client"
import { adminFetch } from "@/lib/admin-fetch"
import { useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"
import { PageHeader, EmptyState, TableSkeleton } from "@/components/admin/ui"

interface Invoice {
  number: string
  order_id: string
  customer_name: string
  total: string
  status: "pending" | "issued" | "cancelled"
  type: "factura" | "nota_remision"
  ruc?: string
  created_at: string
}

export default function InvoicesPage() {
  const { authed } = useAdminAuth()
  const [orders, setOrders] = useState<any[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    order_id: "",
    type: "nota_remision" as "factura" | "nota_remision",
    ruc: ""
  })

  useEffect(() => {
    if (!authed) return
    setLoading(true)
    Promise.all([
      adminFetch("/api/admin/orders").then(r => r.json()),
      adminFetch("/api/admin/invoices").then(r => r.json().catch(() => [])),
    ]).then(([ordersData, invoicesData]) => {
      if (ordersData) {
        setOrders(ordersData.map((o: any) => ({
          ...o,
          items: typeof o.items === "string" ? JSON.parse(o.items) : o.items
        })))
      }
      setInvoices(Array.isArray(invoicesData) ? invoicesData : [])
      setLoading(false)
    })
  }, [authed])

  const createInvoice = async () => {
    const order = orders.find(o => o.id === form.order_id)
    if (!order) return

    const invoice: Invoice = {
      number: `FAC-${Date.now().toString(36).toUpperCase()}`,
      order_id: form.order_id,
      customer_name: order.customer_name || "Invitado",
      total: order.total,
      status: "pending",
      type: form.type,
      ruc: form.ruc,
      created_at: new Date().toISOString()
    }

    await adminFetch("/api/admin/invoices", {
      method: "POST",
      body: JSON.stringify(invoice)
    })

    setInvoices([invoice, ...invoices])
    setShowForm(false)
    setForm({ order_id: "", type: "nota_remision", ruc: "" })
  }

  const updateStatus = async (number: string, status: "pending" | "issued" | "cancelled") => {
    await adminFetch("/api/admin/invoices", {
      method: "PATCH",
      body: JSON.stringify({ number, status })
    })
    setInvoices(invoices.map(i => i.number === number ? { ...i, status } : i))
  }

  const pendingOrders = orders.filter(o => o.payment_status === "verified" && !invoices.find(i => i.order_id === o.id))

  if (!authed) return null

  return (
    <>
      <PageHeader
        title="Facturación / Comprobantes"
        subtitle={`${invoices.length} comprobantes emitidos`}
        actions={
          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
          >
            {showForm ? "Cancelar" : "+ Nuevo comprobante"}
          </button>
        }
      />

      {showForm && (
        <div className="mb-6 rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Nuevo comprobante</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Pedido (pagado/verificado)</label>
              <select
                value={form.order_id}
                onChange={e => setForm({ ...form, order_id: e.target.value })}
                className="w-full rounded-lg border border-zinc-700/60 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50"
              >
                <option value="">Seleccionar pedido</option>
                {pendingOrders.map(o => (
                  <option key={o.id} value={o.id}>#{o.id.slice(0,8)} — {o.customer_name || "Invitado"} — {o.total}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Tipo</label>
              <select
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value as any })}
                className="w-full rounded-lg border border-zinc-700/60 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50"
              >
                <option value="nota_remision">Nota de Remisión</option>
                <option value="factura">Factura (con RUC)</option>
              </select>
            </div>
            {form.type === "factura" && (
              <div>
                <label className="block text-xs text-zinc-400 mb-1">RUC del cliente</label>
                <input
                  value={form.ruc}
                  onChange={e => setForm({ ...form, ruc: e.target.value })}
                  placeholder="00000000-0"
                  className="w-full rounded-lg border border-zinc-700/60 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50"
                />
              </div>
            )}
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={createInvoice} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500">Generar comprobante</button>
            <button onClick={() => setShowForm(false)} className="rounded-lg border border-zinc-700/60 px-4 py-2 text-sm text-zinc-400 hover:text-white">Cancelar</button>
          </div>
        </div>
      )}

      {loading ? (
        <TableSkeleton rows={5} cols={5} />
      ) : invoices.length === 0 ? (
        <EmptyState
          icon={<span className="text-2xl">🧾</span>}
          title="Sin comprobantes"
          description="Los comprobantes aparecerán cuando generés facturas o notas de remisión"
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-800/60">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-800/60 bg-zinc-900/80 text-left">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Número</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Tipo</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Pedido</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Cliente</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Total</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Estado</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {invoices.map((inv) => (
                <tr key={inv.number} className="hover:bg-zinc-800/30">
                  <td className="px-4 py-3 font-mono text-emerald-400">{inv.number}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${inv.type === "factura" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-zinc-800 text-zinc-400 border-zinc-700/50"}`}>
                      {inv.type === "factura" ? "Factura" : "Nota de Remisión"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">#{inv.order_id?.slice(0, 8)}</td>
                  <td className="px-4 py-3 text-white">{inv.customer_name}</td>
                  <td className="px-4 py-3 font-semibold text-white">{inv.total}</td>
                  <td className="px-4 py-3">
                    <select
                      value={inv.status}
                      onChange={e => updateStatus(inv.number, e.target.value as any)}
                      className={`rounded-lg border px-2 py-1 text-xs font-medium outline-none cursor-pointer ${
                        inv.status === "issued" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                        inv.status === "cancelled" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                        "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                    >
                      <option value="pending">Pendiente</option>
                      <option value="issued">Emitido</option>
                      <option value="cancelled">Anulado</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-zinc-500 text-xs">
                    {new Date(inv.created_at).toLocaleDateString("es-PY")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
