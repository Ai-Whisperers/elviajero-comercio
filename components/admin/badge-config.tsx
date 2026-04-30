
"use client"
import { useState, useEffect } from "react"

const KEY = "viajero_badge_config"

export function BadgeConfig() {
  const [badges, setBadges] = useState<string[]>([])

  useEffect(() => {
    try { setBadges(JSON.parse(localStorage.getItem(KEY) || "[]")) } catch {}
  }, [])

  const toggleBadge = (badge: string) => {
    const updated = badges.includes(badge) ? badges.filter(b => b !== badge) : [...badges, badge]
    localStorage.setItem(KEY, JSON.stringify(updated))
    setBadges(updated)
  }

  const available = [
    { id: "isNew", label: "NUEVO", color: "bg-accent text-accent-foreground" },
    { id: "featured", label: "DESTACADO", color: "bg-primary text-primary-foreground" },
    { id: "sale", label: "OFERTA", color: "bg-accent text-accent-foreground" },
    { id: "bestseller", label: "MÁS VENDIDO", color: "bg-amber-500 text-white" },
    { id: "limited", label: "EDICIÓN LIMITADA", color: "bg-purple-500 text-white" },
  ]

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-gray-400">Badges activos</p>
      <div className="flex flex-wrap gap-2">
        {available.map(b => (
          <button key={b.id} onClick={() => toggleBadge(b.id)}
            className={"rounded-full px-3 py-1 text-[10px] font-bold transition-all " + (badges.includes(b.id) ? b.color : "border border-gray-700 text-gray-500")}>
            {b.label}
          </button>
        ))}
      </div>
    </div>
  )
}
