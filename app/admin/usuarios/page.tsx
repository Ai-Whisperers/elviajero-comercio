"use client"
import { useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"
import { PageHeader, SearchInput, DataTable, EmptyState, TableSkeleton, Badge } from "@/components/admin/ui"

export default function AdminUsers() {
  const { authed } = useAdminAuth()
  const [users, setUsers] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authed) return
    setLoading(true)
    fetch("/api/admin/users").then(r => r.json()).then(data => {
      if (Array.isArray(data)) setUsers(data); setLoading(false)
    })
  }, [authed])

  const filtered = search
    ? users.filter(u =>
        (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
        (u.role || "").toLowerCase().includes(search.toLowerCase()))
    : users

  if (!authed) return null

  return (
    <>
      <PageHeader
        title={"Usuarios (" + users.length + ")"}
        actions={<SearchInput value={search} onChange={setSearch} placeholder="Buscar por nombre, email, rol..." />}
      />
      {loading ? (
        <TableSkeleton rows={5} cols={3} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          }
          title={search ? "No se encontraron usuarios" : "Sin usuarios registrados"}
        />
      ) : (
        <DataTable
          headers={[
            { key: "name", label: "Nombre" },
            { key: "email", label: "Email" },
            { key: "role", label: "Rol" },
            { key: "created", label: "Registro" },
          ]}
        >
          {filtered.map((u, i) => (
            <tr key={i} className="text-white hover:bg-zinc-800/50">
              <td className="px-4 py-3">{u.name || "—"}</td>
              <td className="px-4 py-3 text-zinc-400 text-xs">{u.email || "—"}</td>
              <td className="px-4 py-3">
                <Badge status={u.role === "admin" ? "admin" : "customer"}>{u.role === "admin" ? "Admin" : "Cliente"}</Badge>
              </td>
              <td className="px-4 py-3 text-zinc-400 text-xs">{u.created_at ? new Date(u.created_at).toLocaleDateString("es") : "—"}</td>
            </tr>
          ))}
        </DataTable>
      )}
    </>
  )
}
