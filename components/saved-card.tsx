
"use client"
import { useState } from "react"

const KEY = "viajero_saved_card"

export function SavedCardOption() {
  const [checked, setChecked] = useState(false)

  const toggle = () => {
    setChecked(!checked)
    localStorage.setItem(KEY, JSON.stringify(!checked))
  }

  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 transition-all hover:bg-muted">
      <input type="checkbox" checked={checked} onChange={toggle} className="rounded" />
      <div className="text-sm"><p className="font-medium text-foreground">Guardar tarjeta para próximas compras</p><p className="text-xs text-muted-foreground">(solo en este dispositivo)</p></div>
    </label>
  )
}
