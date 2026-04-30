"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

const ADMIN_PASSWORD_HASH = "h1a8c4c"

function hash(s: string) {
  let h = 0; for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h = h & h }
  return "h" + Math.abs(h).toString(36)
}

export function useAdminAuth() {
  const [authed, setAuthed] = useState(false)
  const router = useRouter()
  useEffect(() => { if (localStorage.getItem("viajero_admin_auth") === "true") setAuthed(true) }, [])
  const login = (pass: string) => {
    if (hash(pass) === ADMIN_PASSWORD_HASH) { localStorage.setItem("viajero_admin_auth", "true"); setAuthed(true); return true }
    return false
  }
  const logout = () => { localStorage.removeItem("viajero_admin_auth"); setAuthed(false); router.push("/admin") }
  return { authed, login, logout }
}

const nav = [
  { label: "Dashboard", href: "/admin", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { label: "Productos", href: "/admin/productos", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { label: "Pedidos", href: "/admin/pedidos", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { label: "Promos", href: "/admin/promos", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { label: "Reseñas", href: "/admin/resenas", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { authed, login, logout } = useAdminAuth()
  const pathname = usePathname()
  const [pass, setPass] = useState("")
  const [error, setError] = useState("")

  if (!authed) {
    if (pathname !== "/admin") return null
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] px-4">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-white">Admin</h1>
            <p className="mt-1 text-sm text-gray-400">El Viajero</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); if (!login(pass)) setError("Contraseña incorrecta"); else setError("") }} className="space-y-4">
            {error && <div className="rounded-lg bg-red-900/30 p-3 text-sm text-red-400">{error}</div>}
            <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Contraseña" className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-white outline-none focus:border-green-500" />
            <button type="submit" className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-500">Ingresar</button>
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
