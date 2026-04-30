
"use client"
import { useState, useEffect } from "react"

const NOTIF_KEY = "viajero_admin_notifications"

interface Notification { id: string; message: string; type: "info" | "warning" | "success" | "error"; date: string; read: boolean }

export function addNotification(message: string, type: Notification["type"] = "info") {
  try {
    const all: Notification[] = JSON.parse(localStorage.getItem(NOTIF_KEY) || "[]")
    all.unshift({ id: Date.now().toString(36), message, type, date: new Date().toISOString(), read: false })
    if (all.length > 100) all.length = 100
    localStorage.setItem(NOTIF_KEY, JSON.stringify(all))
  } catch {}
}

export function triggerStockNotifications() {
  try {
    const products = JSON.parse(localStorage.getItem("viajero_admin_products") || "[]")
    products.forEach((p: any) => {
      if ((p.stock || 0) <= 3 && (p.stock || 0) > 0) addNotification("Stock bajo: " + p.name + " (" + p.stock + " un.)", "warning")
      if ((p.stock || 0) === 0) addNotification("Agotado: " + p.name, "error")
    })
  } catch {}
}

export function AdminNotificationPanel() {
  const [notifs, setNotifs] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const all: Notification[] = JSON.parse(localStorage.getItem(NOTIF_KEY) || "[]")
    setNotifs(all)
  }, [])

  const markRead = (id: string) => {
    const updated = notifs.map(n => n.id === id ? { ...n, read: true } : n)
    setNotifs(updated)
    localStorage.setItem(NOTIF_KEY, JSON.stringify(updated))
  }

  const unread = notifs.filter(n => !n.read).length

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:text-white transition-all">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
        {unread > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[14px] items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white px-0.5">{unread > 9 ? "9+" : unread}</span>}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-gray-800 bg-gray-900 shadow-xl max-h-96 overflow-y-auto">
          <div className="border-b border-gray-800 px-4 py-3">
            <p className="text-sm font-semibold text-white">Notificaciones</p>
          </div>
          {notifs.length === 0 && <div className="px-4 py-8 text-center text-sm text-gray-500">Sin notificaciones</div>}
          {notifs.map(n => (
            <div key={n.id} onClick={() => markRead(n.id)} className={"cursor-pointer border-b border-gray-800 px-4 py-3 transition-all hover:bg-gray-800 " + (n.read ? "opacity-50" : "")}>
              <div className="flex items-start gap-2">
                <span className="mt-0.5">{n.type === "warning" ? "⚠️" : n.type === "error" ? "❌" : n.type === "success" ? "✅" : "ℹ️"}</span>
                <div className="flex-1"><p className="text-sm text-gray-200">{n.message}</p><p className="text-xs text-gray-500 mt-0.5">{new Date(n.date).toLocaleDateString("es", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
