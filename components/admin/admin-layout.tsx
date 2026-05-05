"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AdminSidebar } from "./sidebar"

interface Profile { id: string; name: string; email: string; role: string }

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
        setAuthed(true); setAdmin({ id: data.id, name: data.name, email: session.user.email || "", role: data.role })
      }
      setLoading(false)
    })
  }, [supabase, router])

  return { authed, admin, loading }
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { authed, loading } = useAdminAuth()
  const router = useRouter()
  const supabase = createClient()

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]" /></div>
  if (!authed) { router.push("/login"); return null }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">Panel de Administración</h1>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-gray-500 hover:text-[var(--color-primary)]">Ver sitio</Link>
            <button onClick={() => { supabase.auth.signOut(); router.push("/login") }} className="text-sm text-red-500 hover:text-red-700">Salir</button>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
