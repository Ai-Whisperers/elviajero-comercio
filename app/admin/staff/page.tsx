"use client"
import { useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"
import { PageHeader, EmptyState, TableSkeleton } from "@/components/admin/ui"

const roleLabels: Record<string, string> = {
  admin: "Administrador",
  ventas: "Ventas",
  bodega: "Bodega",
  customer: "Cliente",
}

const roleColors: Record<string, string> = {
  admin: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  ventas: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  bodega: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  customer: "bg-zinc-800 text-zinc-400 border-zinc-700/50",
}

export default function StaffPage() {
  const { authed } = useAdminAuth()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authed) return
    setLoading(true)
    fetch("/api/admin/staff")
      .then(r => r.json())
      .then(data => { setUsers(Array.isArray(data) ? data : []); setLoading(false) })
  }, [authed])

  const updateRole = async (id: string, role: string) => {
    await fetch("/api/admin/staff", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, role }) })
    setUsers(users.map(u => u.id === id ? { ...u, role } : u))
  }

  if (!authed) return null

  return (
    <>
      <PageHeader title="Equipo / Staff" subtitle={`${users.length} usuarios registrados`} />

      {loading ? (
        <TableSkeleton rows={5} cols={4} />
      ) : users.length === 0 ? (
        <EmptyState icon={<span className="text-2xl">👥</span>} title="Sin usuarios" description="Los usuarios aparecerán cuando se registren" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-800/60">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-800/60 bg-zinc-900/80 text-left">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Nombre</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Email</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Rol</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Teléfono</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-zinc-800/30">
                  <td className="px-4 py-3 text-white font-medium">{u.name || "Sin nombre"}</td>
                  <td className="px-4 py-3 text-zinc-400">{u.email?.email || u.email || "-"}</td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role || "customer"}
                      onChange={e => updateRole(u.id, e.target.value)}
                      className={`rounded-lg border px-2 py-1 text-xs font-medium outline-none cursor-pointer ${roleColors[u.role || "customer"] || roleColors.customer}`}
                    >
                      {Object.entries(roleLabels).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{u.phone || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
