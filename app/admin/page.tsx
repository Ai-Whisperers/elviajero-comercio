'use client'
import { AdminShell, useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"
import { PageHeader, StatCard, StatsGridSkeleton, Badge } from "@/components/admin/ui"
import Link from "next/link"

function DashboardContent() {
  const { authed } = useAdminAuth()
  const [stats, setStats] = useState({ users: 0, orders: 0, revenue: 0, products: 0, monthOrders: 0, monthRevenue: 0 })
  const [recentOrders, setRecentOrders] = useState<any[]>([])

  useEffect(() => {
    if (!authed) return
    fetch("/api/admin/stats").then(r => r.json()).then(data => {
      setStats({ users: data.users, orders: data.orders, revenue: data.revenue, products: data.products, monthOrders: data.monthOrders, monthRevenue: data.monthRevenue })
      setRecentOrders(data.recentOrders || [])
    })
  }, [authed])

  const format = (n: number) => 'Gs. ' + n.toLocaleString('es-PY')

  if (!authed) return null

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Vista general de tu tienda" />

      {stats.products === 0 && stats.users === 0 ? (
        <StatsGridSkeleton count={5} />
      ) : (
      <>
      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="mb-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Acciones rápidas</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Editar contenido", href: "/admin/contenido", desc: "Hero, FAQ, footer", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
            { label: "Blog", href: "/admin/blog", desc: "Administrar posts", icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" },
            { label: "Fotos", href: "/admin/fotos", desc: "Subir imágenes", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
            { label: "Importar", href: "/admin/importar", desc: "Productos CSV", icon: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" },
          ].map(a => (
            <a key={a.href} href={a.href}
              className="group rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4 hover:border-zinc-700/60 hover:bg-zinc-900 transition-all">
              <svg className="w-5 h-5 text-emerald-400 mb-3 group-hover:text-emerald-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={a.icon} />
              </svg>
              <p className="font-semibold text-zinc-100 text-sm">{a.label}</p>
              <p className="text-xs text-zinc-500 mt-1">{a.desc}</p>
            </a>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8 lg:grid-cols-5">
        <StatCard label="Usuarios" value={stats.users.toString()} color="blue" />
        <StatCard label="Productos" value={stats.products.toString()} color="purple" />
        <StatCard label="Pedidos totales" value={stats.orders.toString()} color="emerald" />
        <StatCard label="Pedidos del mes" value={stats.monthOrders.toString()} color="amber" />
        <StatCard label="Ingresos del mes" value={format(stats.monthRevenue)} color="emerald" />
      </div>

      {recentOrders.length > 0 && (
        <>
          <h2 className="mb-3 text-base font-bold text-white">Pedidos recientes</h2>
          <div className="space-y-2">
            {recentOrders.map((o) => (
              <Link key={o.id} href={"/admin/pedidos/detalle?id=" + o.id}
                className="flex items-center justify-between rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-3 hover:border-zinc-700/60 transition-all">
                <div>
                  <p className="text-sm font-medium text-white">#{o.id?.slice(0, 8)}</p>
                  <p className="text-xs text-zinc-500">{o.created_at ? new Date(o.created_at).toLocaleDateString('es') : ''}</p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <p className="text-sm font-bold text-white">{o.total}</p>
                  <Badge status={o.status}>{o.status}</Badge>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
      </>)}
    </>
  )
}

export default function AdminPage() { return <AdminShell><DashboardContent /></AdminShell> }
