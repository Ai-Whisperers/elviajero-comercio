"use client"
import { AdminShell, useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"

export default function AdminSubscribers() {
  const { authed } = useAdminAuth()
  const [subs, setSubs] = useState<any[]>([])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!authed) return
    fetch("/api/admin/subscribers").then(r => r.json()).then(data => { if (Array.isArray(data)) setSubs(data) })
  }, [authed])

  const copyAll = () => {
    navigator.clipboard.writeText(subs.map(s => s.email).join("\n")).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  if (!authed) return null

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Suscriptores ({subs.length})</h1>
        <button onClick={copyAll} className="rounded-lg border border-zinc-700/60 px-3 py-1.5 text-xs text-zinc-400 hover:text-white transition-all">{copied ? "Copiado!" : "Copiar todos"}</button>
      </div>
      <div className="rounded-xl border border-zinc-800/60">
        <div className="max-h-96 overflow-y-auto">
          {subs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-zinc-500"><svg className="w-12 h-12 mb-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg><p className="text-sm text-zinc-500">Sin suscriptores todavía</p></div>
          ) : (
            subs.map((s, i) => (
              <div key={i} className="border-b border-zinc-800/60 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 transition-all">{s.email}</div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
