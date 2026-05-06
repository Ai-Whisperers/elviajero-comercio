"use client"
import { AdminShell, useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"
import { PageHeader, EmptyState, TableSkeleton } from "@/components/admin/ui"

export default function AdminSubscribers() {
  const { authed } = useAdminAuth()
  const [subs, setSubs] = useState<any[]>([])
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authed) return
    setLoading(true)
    fetch("/api/admin/subscribers").then(r => r.json()).then(data => {
      if (Array.isArray(data)) setSubs(data); setLoading(false)
    })
  }, [authed])

  const copyAll = () => {
    navigator.clipboard.writeText(subs.map(s => s.email).join("\n")).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  if (!authed) return null

  return (
    <>
      <PageHeader title={"Suscriptores (" + subs.length + ")"} actions={
        subs.length > 0 && (
          <button onClick={copyAll} className="rounded-lg border border-zinc-700/60 px-3 py-1.5 text-xs text-zinc-400 hover:text-white transition-all">
            {copied ? "Copiado!" : "Copiar todos los emails"}
          </button>
        )
      } />
      <div className="rounded-xl border border-zinc-800/60">
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4"><TableSkeleton rows={6} cols={1} /></div>
          ) : subs.length === 0 ? (
            <EmptyState
              icon={
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
              title="Sin suscriptores todavía"
            />
          ) : (
            subs.map((s, i) => (
              <div key={i} className="border-b border-zinc-800/60 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 transition-all flex items-center justify-between">
                <span>{s.email}</span>
                <span className="text-xs text-zinc-600">{s.created_at ? new Date(s.created_at).toLocaleDateString("es") : ""}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
