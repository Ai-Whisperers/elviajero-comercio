"use client"
import Link from "next/link"
import { EmptyState, Badge } from "@/components/admin/ui"
import { formatCurrency } from "@/lib/site-config"

interface Customer {
  id: string
  name?: string
  email?: string
  phone?: string
}

interface Order {
  id: string
  total?: string
  status?: string
  created_at?: string
  items?: any[]
  user_id?: string
}

const statusColors: Record<string, string> = {
  pendiente: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  confirmado: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  enviado: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  entregado: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  cancelado: "bg-red-500/10 text-red-400 border-red-500/20",
}

interface CustomerDetailProps {
  customer: Customer | undefined
  orders: Order[]
  loading: boolean
}

export function CustomerDetail({ customer, orders, loading }: CustomerDetailProps) {
  const totalSpent = orders.reduce((s, o) => {
    const n = parseInt((o.total || "0").replace(/[^0-9]/g, ""), 10) || 0
    return s + n
  }, 0)

  if (!customer) {
    return (
      <EmptyState
        icon={
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        }
        title="Seleccioná un cliente"
        description="para ver su historial de pedidos"
      />
    )
  }

  return (
    <>
      {/* Customer header */}
      <div className="mb-6 rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-6">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-lg font-bold text-emerald-400">
              {(customer?.name || "?")[0].toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{customer?.name || "Cliente"}</h2>
              <p className="text-sm text-zinc-500">{customer?.email || ""}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-emerald-400">{formatCurrency(totalSpent)}</p>
            <p className="text-xs text-zinc-500 mt-0.5">total gastado</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-5 text-sm border-t border-zinc-800/60 pt-4">
          {customer?.phone && (
            <div className="flex items-center gap-2 text-zinc-400">
              <span className="text-zinc-600">📞</span>
              <span>{customer.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="text-zinc-600">📧</span>
            <span className="truncate max-w-[200px]">{customer?.email}</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-400">
            <span className="text-zinc-600">📦</span>
            <span>{orders.length} pedidos</span>
          </div>
        </div>
      </div>

      {/* Orders list */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Pedidos</h3>
        {customer?.phone && (
          <a
            href={`https://wa.me/${customer.phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700/60 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-all"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp
          </a>
        )}
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800" />
                  <div>
                    <div className="h-4 w-24 rounded-md bg-zinc-800 mb-2" />
                    <div className="h-3 w-16 rounded-md bg-zinc-800" />
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-4 w-20 rounded-md bg-zinc-800 mb-1" />
                  <div className="h-4 w-16 rounded-md bg-zinc-800" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-500 rounded-xl border border-zinc-800/60 bg-zinc-900/50">
          <svg className="w-10 h-10 mb-3 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-sm text-zinc-500">Sin pedidos todavía</p>
        </div>
      ) : (
        <div className="space-y-2">
          {orders.map(o => (
            <Link
              key={o.id}
              href={"/admin/pedidos/detalle?id=" + o.id}
              className="block rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4 hover:border-zinc-700/60 hover:bg-zinc-900/80 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center justify-center w-10 h-10 rounded-lg bg-zinc-800 text-xs font-bold text-zinc-300">
                    {new Date(o.created_at || "").getDate() || "—"}
                    <span className="text-[9px] text-zinc-500">
                      {new Date(o.created_at || "").toLocaleDateString("es", { month: "short" }) || ""}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">#{o.id?.slice(0, 8)}</p>
                    <p className="text-xs text-zinc-500">{o.items?.length || 0} artículos</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-sm">{o.total}</p>
                  <Badge status={o.status || "pendiente"}>{o.status}</Badge>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
