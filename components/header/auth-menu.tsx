"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export function AuthMenu() {
  const [user, setUser] = useState<any>(null)
  const [open, setOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase.from("profiles").select("name, role").eq("id", session.user.id).single().then(({ data }) => {
          setUser({ id: session.user.id, email: session.user.email, name: data?.name || session.user.email?.split("@")[0] || "", role: data?.role || "customer" })
        })
      }
    })
  }, [supabase])

  if (!user) return <Link href="/login" className="text-sm text-gray-600 hover:text-[var(--color-primary)]">Ingresar</Link>

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="text-sm text-gray-600 hover:text-[var(--color-primary)]">{user.name}</button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50" onMouseLeave={() => setOpen(false)}>
          <Link href="/mi-cuenta" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Mi Cuenta</Link>
          <Link href="/mi-cuenta/pedidos" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Mis Pedidos</Link>
          {user.role === "admin" && <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Admin</Link>}
          <button onClick={() => { supabase.auth.signOut(); setUser(null); setOpen(false) }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">Cerrar Sesión</button>
        </div>
      )}
    </div>
  )
}
