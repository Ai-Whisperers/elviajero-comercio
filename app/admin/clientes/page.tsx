"use client"
import { AdminShell, useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"
import Link from "next/link"

const statusColors: Record<string, string> = {
  pendiente: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  confirmado: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  enviado: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  entregado: "bg-green-500/10 text-green-400 border-green-500/20",
  cancelado: "bg-red-500/10 text-red-400 border-red-500/20",
}

export default function AdminCustomerHistory() {
  const { authed } = useAdminAuth()
  const [profiles, setProfiles] = useState<any[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (!authed) return
    setLoading(true)
    fetch("/api/admin/customers").then(r => r.json()).then(data => { if (Array.isArray(data)) setProfiles(data); setLoading(false) })
  }, [authed])

  useEffect(() => {
    if (!selected) return
    fetch("/api/admin/orders").then(r => r.json()).then(data => {
      if (Array.isArray(data)) setOrders(data.filter((o: any) => o.user_id === selected))
    })
  }, [selected])

  if (!authed) return null

  const customer = profiles.find(p => p.id === selected)
  const totalSpent = orders.reduce((s, o) => {
    const n = parseInt((o.total || "0").replace(/[^0-9]/g, ""), 10) || 0
    return s + n
  }, 0)

  const filteredProfiles = search
    ? profiles.filter(p => (p.name || "").toLowerCase().includes(search.toLowerCase()) || (p.email || "").toLowerCase().includes(search.toLowerCase()))
    : profiles

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Historial de clientes</h1>
        <p className="text-sm text-gray-500 mt-0.5">{profiles.length} clientes registrados</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* Customer list sidebar */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar cliente..."
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none focus:border-green-500 placeholder-gray-500" />
          </div>
          <div className="max-h-[600px] overflow-y-auto divide-y divide-gray-800">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse p-4">
                  <div className="h-4 w-32 rounded bg-gray-800 mb-2" />
                  <div className="h-3 w-48 rounded bg-gray-800" />
                </div>
              ))
            ) : filteredProfiles.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-gray-500">
                <svg className="w-10 h-10 mb-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <p className="text-sm">{search ? "Sin resultados" : "Sin clientes"}</p>
              </div>
            ) : (
              filteredProfiles.map(p => (
                <button key={p.id} onClick={() => setSelected(p.id)}
                  className={`w-full text-left p-4 transition-colors hover:bg-gray-800/50 ${selected === p.id ? "bg-green-600/10 border-l-2 border-green-500" : ""}`}>
                  <p className="font-medium text-white text-sm">{p.name || "Sin nombre"}</p>
                    <p className="text-sm text-gray-500">{p.phone || "Sin contacto"}</p>
                  {p.phone && <p className="text-xs text-gray-600 mt-0.5">{p.phone}</p>}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Customer detail panel */}
        <div>
          {!selected ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-500 rounded-xl border border-gray-800 bg-gray-900">
              <svg className="w-16 h-16 mb-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-base font-medium text-gray-400">Seleccioná un cliente</p>
              <p className="text-sm text-gray-600 mt-1">para ver su historial de pedidos</p>
            </div>
          ) : (
            <>
              {/* Customer header */}
              <div className="mb-6 rounded-xl border border-gray-800 bg-gray-900 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-white">{customer?.name || "Cliente"}</h2>
                    <p className="text-sm text-gray-500">{customer?.email || ""}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-400">Gs. {totalSpent.toLocaleString("es-PY")}</p>
                    <p className="text-xs text-gray-500">total gastado</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-6 text-sm">
                  {customer?.phone && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <span className="text-gray-600">📞</span>
                      <span>{customer.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="text-gray-600">🆔</span>
                    <span className="font-mono text-xs">{customer?.id?.slice(0, 12)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="text-gray-600">📦</span>
                    <span>{orders.length} pedidos</span>
                  </div>
                </div>
              </div>

              {/* Orders list */}
              <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Pedidos</h3>
              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500 rounded-xl border border-gray-800 bg-gray-900">
                  <svg className="w-10 h-10 mb-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                  <p className="text-sm text-gray-500">Sin pedidos</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {orders.map(o => (
                    <Link key={o.id} href={"/admin/pedidos/detalle?id=" + o.id}
                      className="block rounded-xl border border-gray-800 bg-gray-900 p-4 hover:border-gray-700 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col items-center justify-center w-10 h-10 rounded-lg bg-gray-800 text-xs font-bold text-gray-300">
                            {new Date(o.created_at || "").getDate() || "—"}
                            <span className="text-[9px] text-gray-500">
                              {new Date(o.created_at || "").toLocaleDateString("es", { month: "short" }) || ""}
                            </span>
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm">#{o.id?.slice(0, 8)}</p>
                            <p className="text-xs text-gray-500">{o.items?.length || 0} artículos</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold text-sm">{o.total}</p>
                          <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${statusColors[o.status] || "bg-gray-800 text-gray-400 border-gray-700"}`}>
                            {o.status}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
