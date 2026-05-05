"use client"
import { AdminShell, useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"

export default function AdminUsers() {
  const { authed } = useAdminAuth()
  const [users, setUsers] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authed) return
    setLoading(true)
    fetch("/api/admin/users").then(r => r.json()).then(data => { if (Array.isArray(data)) setUsers(data); setLoading(false) })
  }, [authed])

  const filtered = search
    ? users.filter(u =>
        (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (u.role || "").toLowerCase().includes(search.toLowerCase()))
    : users

  if (!authed) return null

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Usuarios ({filtered.length})</h1>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nombre, email, rol..."
          className="w-64 rounded-lg border border-zinc-700/60 bg-zinc-800 px-4 py-2 text-sm text-white outline-none focus:border-emerald-500/50" />
      </div>
      <div className="overflow-x-auto rounded-xl border border-zinc-800/60">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 border-b border-zinc-800/60 bg-zinc-900/50 text-left">
            <tr><th className="px-4 py-3 text-zinc-400">Nombre</th><th className="px-4 py-3 text-zinc-400">Rol</th><th className="px-4 py-3 text-zinc-400">Registro</th></tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-3"><div className="h-4 w-32 rounded bg-zinc-800" /></td>
                  <td className="px-4 py-3"><div className="h-5 w-16 rounded-full bg-zinc-800" /></td>
                  <td className="px-4 py-3"><div className="h-4 w-24 rounded bg-zinc-800" /></td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr><td colSpan={3} className="px-4 py-12 text-center text-sm text-zinc-500">
                <svg className="mx-auto w-10 h-10 mb-3 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg>
                {search ? "No se encontraron usuarios con ese filtro" : "Sin usuarios registrados"}
              </td></tr>
            ) : (
              filtered.map((u, i) => (
                <tr key={i} className="text-white hover:bg-zinc-800/50">
                  <td className="px-4 py-3">{u.name || "—"}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${u.role === "admin" ? "bg-green-900/30 text-green-400" : "bg-zinc-800 text-zinc-400"}`}>{u.role || "customer"}</span></td>
                  <td className="px-4 py-3 text-zinc-400">{u.created_at ? new Date(u.created_at).toLocaleDateString("es") : "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
