"use client"
import { AdminShell, useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export default function AdminSubscribers() {
  const { authed } = useAdminAuth()
  const supabase = createClient()
  const [subs, setSubs] = useState<any[]>([])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!authed) return
    supabase.from("ej_subscribers").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setSubs(data)
    })
  }, [authed, supabase])

  const copyAll = () => {
    navigator.clipboard.writeText(subs.map(s => s.email).join("\n")).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  if (!authed) return null

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Suscriptores ({subs.length})</h1>
        <button onClick={copyAll} className="rounded-lg border border-gray-700 px-3 py-1.5 text-xs text-gray-400 hover:text-white transition-all">{copied ? "Copiado!" : "Copiar todos"}</button>
      </div>
      <div className="rounded-xl border border-gray-800">
        <div className="max-h-96 overflow-y-auto">
          {subs.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-gray-500">Sin suscriptores</div>
          ) : (
            subs.map((s, i) => (
              <div key={i} className="border-b border-gray-800 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 transition-all">{s.email}</div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
