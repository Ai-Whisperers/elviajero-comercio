"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface Profile {
  id: string
  name: string
  email: string
  role: string
}

export function useAdminAuth() {
  const [authed, setAuthed] = useState(false)
  const [admin, setAdmin] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { setLoading(false); return }
      const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()
      if (data && data.role === "admin") {
        setAuthed(true)
        setAdmin({ id: data.id, name: data.name, email: session.user.email || "", role: data.role })
      }
      setLoading(false)
    })
  }, [supabase])

  const login = async (email: string, password: string) => {
    const { data: { session }, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error || !session) return false

    const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()
    if (!data || data.role !== "admin") {
      await supabase.auth.signOut()
      return false
    }
    setAuthed(true)
    setAdmin({ id: data.id, name: data.name, email: session.user.email || "", role: data.role })
    return true
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setAuthed(false)
    setAdmin(null)
    router.push("/admin")
  }

  return { authed, admin, loading, login, logout }
}

const nav = [
  { label: "Dashboard", href: "/admin", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { label: "Productos", href: "/admin/productos", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { label: "Pedidos", href: "/admin/pedidos", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { label: "Promos", href: "/admin/promos", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { label: "Reseñas", href: "/admin/resenas", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
  { label: "Usuarios", href: "/admin/usuarios", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" },
  { label: "Categorías", href: "/admin/categorias", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
  { label: "Suscriptores", href: "/admin/suscriptores", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { label: "Reportes", href: "/admin/reportes", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { label: "Importar CSV", href: "/admin/importar", icon: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" },
  { label: "Tema", href: "/admin/tema", icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" },
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { authed, loading, login, logout } = useAdminAuth()
  const pathname = usePathname()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [logging, setLogging] = useState(false)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A]">
        <p className="text-sm text-gray-500">Cargando...</p>
      </div>
    )
  }

  if (!authed) {
    if (pathname !== "/admin") return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A]">
        <p className="text-sm text-gray-500">Acceso denegado</p>
      </div>
    )

    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] px-4">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-white">Admin</h1>
            <p className="mt-1 text-sm text-gray-400">El Viajero</p>
          </div>
          <form onSubmit={async (e) => {
            e.preventDefault(); setError(""); setLogging(true)
            const ok = await login(email, password)
            setLogging(false)
            if (!ok) setError("Credenciales incorrectas o no tienes permisos de administrador")
          }} className="space-y-4">
            {error && <div className="rounded-lg bg-red-900/30 p-3 text-sm text-red-400">{error}</div>}
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-white outline-none focus:border-green-500" required />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-white outline-none focus:border-green-500" required />
            <button type="submit" disabled={logging} className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-500 disabled:opacity-50">
              {logging ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#0A0A0A]">
      <aside className="hidden w-64 border-r border-gray-800 p-4 md:block">
        <div className="mb-8">
          <h1 className="text-lg font-bold text-white">⚙️ Admin</h1>
          <p className="text-xs text-gray-500">El Viajero</p>
        </div>
        <nav className="flex flex-col gap-1">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${pathname === n.href ? "bg-green-600/20 text-green-400" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d={n.icon}/></svg>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 border-t border-gray-800 pt-4">
          <Link href="/" className="block text-xs text-gray-500 hover:text-gray-300 mb-2">← Ver tienda</Link>
          <button onClick={logout} className="text-xs text-red-400 hover:text-red-300">Cerrar sesión</button>
        </div>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
