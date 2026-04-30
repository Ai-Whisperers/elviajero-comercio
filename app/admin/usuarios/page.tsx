
"use client"
import { AdminShell, useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"

export default function AdminUsers() {
  const { authed } = useAdminAuth()
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    if (!authed) return
    const all = JSON.parse(localStorage.getItem("viajero_users") || "[]")
    setUsers(all.map((u: any) => ({ ...u, password: "***" })))
  }, [authed])

  if (!authed) return null

  return (
    <>
      <h1 className="mb-6 text-xl font-bold text-white">Usuarios ({users.length})</h1>
      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-800 bg-gray-900 text-left">
            <tr><th className="px-4 py-3 text-gray-400">Nombre</th><th className="px-4 py-3 text-gray-400">Email</th><th className="px-4 py-3 text-gray-400">Teléfono</th><th className="px-4 py-3 text-gray-400">Registro</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {users.map((u, i) => (
              <tr key={i} className="text-white hover:bg-gray-800/50">
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3 text-gray-400">{u.email}</td>
                <td className="px-4 py-3">{u.phone || "—"}</td>
                <td className="px-4 py-3 text-gray-400">{u.createdAt ? new Date(u.createdAt).toLocaleDateString("es") : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
