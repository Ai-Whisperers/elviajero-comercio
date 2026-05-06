"use client"
import { AdminShell, useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"
import { PageHeader } from "@/components/admin/ui"

const THEME_KEY = "viajero_admin_theme"

const PRESETS = [
  { name: "Verde (default)", primary: "#1B5E20", bg: "#0A0A0A", card: "#1A1A2E" },
  { name: "Azul", primary: "#1565C0", bg: "#0A0A1A", card: "#1A1A2E" },
  { name: "Violeta", primary: "#6A1B9A", bg: "#0A001A", card: "#1A1A2E" },
  { name: "Naranja", primary: "#E65100", bg: "#1A0A00", card: "#1A1A2E" },
  { name: "Gris oscuro", primary: "#37474F", bg: "#0A0A0A", card: "#1A1A2E" },
]

export default function AdminTheme() {
  const { authed } = useAdminAuth()
  const [theme, setTheme] = useState(PRESETS[0])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!authed) return
    // Load from localStorage first
    try {
      const local = JSON.parse(localStorage.getItem(THEME_KEY) || "null")
      if (local) setTheme(local)
    } catch {}
    // Load from DB
    fetch("/api/admin/theme").then(r => r.json()).then(data => {
      if (data?.theme) {
        const t = JSON.parse(data.theme)
        setTheme(t)
        localStorage.setItem(THEME_KEY, JSON.stringify(t))
        applyTheme(t)
      }
    })
  }, [authed])

  const applyTheme = (t: typeof PRESETS[0]) => {
    document.documentElement.style.setProperty("--admin-primary", t.primary)
    document.documentElement.style.setProperty("--admin-bg", t.bg)
    document.documentElement.style.setProperty("--admin-card", t.card)
  }

  const apply = async (t: typeof PRESETS[0]) => {
    setTheme(t)
    localStorage.setItem(THEME_KEY, JSON.stringify(t))
    applyTheme(t)
    // Persist to DB
    setSaving(true)
    await fetch("/api/admin/theme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme: JSON.stringify(t) }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!authed) return null

  return (
    <>
      <PageHeader
        title="Personalizar tema"
        subtitle="El tema se guarda en tu cuenta y persiste entre sesiones"
        actions={
          saved && <span className="text-xs text-emerald-400">✓ Guardado</span>
        }
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 mb-8">
        {PRESETS.map((p) => (
          <button key={p.name} onClick={() => apply(p)} disabled={saving}
            className={"rounded-xl border-2 p-4 text-center transition-all " + (theme.name === p.name ? "border-emerald-500" : "border-zinc-700/60 hover:border-zinc-500")}>
            <div className="mb-3 flex items-center justify-center gap-2">
              <div className="h-8 w-8 rounded-full" style={{ backgroundColor: p.primary }} />
              <div className="h-8 w-8 rounded-lg" style={{ backgroundColor: p.card }} />
              <div className="h-8 w-8 rounded-lg" style={{ backgroundColor: p.bg }} />
            </div>
            <p className="text-xs text-zinc-400">{p.name}</p>
            {saving && theme.name === p.name && <p className="text-[10px] text-emerald-400 mt-1">Guardando...</p>}
          </button>
        ))}
      </div>
      <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5">
        <h2 className="mb-3 text-sm font-semibold text-zinc-300">Vista previa</h2>
        <div className="rounded-xl p-4" style={{ backgroundColor: theme.card }}>
          <div className="mb-2 h-3 w-24 rounded" style={{ backgroundColor: theme.primary }} />
          <div className="h-3 w-48 rounded bg-zinc-700" />
        </div>
      </div>
    </>
  )
}
