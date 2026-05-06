"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@ai-whisperers/auth/supabase/browser"
import { AdminSidebar } from "./sidebar"
import { Package, LogOut, ExternalLink, Menu, User } from "lucide-react"

interface Profile { id: string; name: string; email: string; role: string }

export function useAdminAuth() {
  const [authed, setAuthed] = useState(false)
  const [admin, setAdmin] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let cancelled = false

    async function checkAuth() {
      try {
        // 1) Try localStorage session (set by login page)
        const stored = localStorage.getItem("elviajero_admin_session")
        if (stored) {
          const session = JSON.parse(stored)
          const accessToken = session.access_token || session
          const res = await fetch("/api/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}` },
            body: JSON.stringify({ action: "me" }),
          })
          const data = await res.json()
          if (res.ok && data.ok && data.user?.role === "admin") {
            if (!cancelled) { setAuthed(true); setAdmin(data.user); setLoading(false) }
            return
          }
        }

        // 2) Fallback: try Supabase SSR cookie
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()
          if (profile && profile.role === "admin") {
            if (!cancelled) { setAuthed(true); setAdmin({ id: profile.id, name: profile.name, email: session.user.email || "", role: profile.role }); setLoading(false) }
            return
          }
        }

        // 3) Fallback: our custom cookie
        const cookies = document.cookie.split("; ").reduce((acc, c) => {
          const [k, v] = c.split("=", 2)
          acc[k.trim()] = v
          return acc
        }, {} as Record<string, string>)
        const token = cookies["elviajero_admin_token"]
        if (token) {
          const res = await fetch("/api/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ action: "me" }),
          })
          const data = await res.json()
          if (res.ok && data.ok && data.user?.role === "admin") {
            if (!cancelled) { setAuthed(true); setAdmin(data.user); setLoading(false) }
            return
          }
        }
      } catch {}
      if (!cancelled) setLoading(false)
    }

    checkAuth()
    return () => { cancelled = true }
  }, [router])

  return { authed, admin, loading }
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { authed, loading } = useAdminAuth()
  const router = useRouter()
  const supabaseRef = useRef(createClient())
  const [mobileMenu, setMobileMenu] = useState(false)
  const [name, setName] = useState("")

  useEffect(() => {
    if (loading) return
    if (!authed) { router.push("/login?redirect=/admin"); return }
    supabaseRef.current.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setName(session.user.email?.split("@")[0] || "Admin")
    })
  }, [authed, loading, router])

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0a0b]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30" />
          <div className="absolute inset-1 rounded-full border-t-2 border-emerald-400 animate-spin" />
        </div>
        <p className="text-sm text-zinc-500 font-medium">Cargando panel...</p>
      </div>
    </div>
  )
  if (!authed) return null

  return (
    <div className="flex min-h-screen bg-[#0a0a0b]">
      {mobileMenu && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setMobileMenu(false)} />
      )}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0f0f10] border-r border-zinc-800/60 transform transition-transform duration-200 lg:relative lg:translate-x-0 ${mobileMenu ? 'translate-x-0' : '-translate-x-full'}`}>
        <AdminSidebar onNavigate={() => setMobileMenu(false)} />
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-[#0f0f10]/80 backdrop-blur-xl border-b border-zinc-800/60">
          <div className="flex items-center justify-between px-4 sm:px-6 h-14">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileMenu(!mobileMenu)} className="lg:hidden p-2 -ml-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
                <Menu className="w-5 h-5" />
              </button>
              <div className="hidden sm:flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-semibold text-white">El Viajero</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-all">
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ver sitio</span>
              </Link>
              <div className="w-px h-5 bg-zinc-800 mx-1" />
              <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-zinc-800/40">
                <User className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-xs text-zinc-400 font-medium">{name}</span>
              </div>
              <button onClick={async () => { await supabaseRef.current.auth.signOut(); window.location.href = "/login" }}
                className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800/60 transition-all" title="Cerrar sesión">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
