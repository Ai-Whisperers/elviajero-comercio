
"use client"
import { useState } from "react"

const STORAGE_KEY = "viajero_notif_prefs"

interface Prefs {
  email: boolean
  whatsapp: boolean
  orderUpdates: boolean
  promotions: boolean
  newsletter: boolean
}

const defaults: Prefs = {
  email: true, whatsapp: true,
  orderUpdates: true, promotions: false, newsletter: true,
}

export function NotificationPrefs() {
  const [prefs, setPrefs] = useState<Prefs>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(defaults)) }
    catch { return defaults }
  })
  const [saved, setSaved] = useState(false)

  const toggle = (key: keyof Prefs) => {
    const next = { ...prefs, [key]: !prefs[key] }
    setPrefs(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const items: { key: keyof Prefs; label: string; desc: string }[] = [
    { key: "email", label: "Notificaciones por email", desc: "Recibí emails sobre tus pedidos" },
    { key: "whatsapp", label: "Notificaciones por WhatsApp", desc: "Actualizaciones de envío vía WhatsApp" },
    { key: "orderUpdates", label: "Actualizaciones de pedidos", desc: "Cambios en el estado de tu pedido" },
    { key: "promotions", label: "Promociones y ofertas", desc: "Descuentos y ofertas especiales" },
    { key: "newsletter", label: "Newsletter semanal", desc: "Novedades y artículos del blog" },
  ]

  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Preferencias de notificación</h2>
        {saved && <span className="text-xs text-success">Guardado</span>}
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <label key={item.key} className="flex cursor-pointer items-center justify-between rounded-lg border border-border p-3 transition-all hover:bg-muted">
            <div>
              <p className="text-sm font-medium text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <div
              onClick={() => toggle(item.key)}
              className={"relative h-5 w-9 rounded-full transition-colors " + (prefs[item.key] ? "bg-primary" : "bg-muted-foreground/30")}
            >
              <div className={"absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform " + (prefs[item.key] ? "translate-x-4" : "translate-x-0.5")} />
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}
