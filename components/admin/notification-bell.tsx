"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"

export function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [unread, setUnread] = useState(0)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch("/api/admin/notifications")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setNotifications(data.slice(0, 10))
          setUnread(data.filter((n: any) => !n.read).length)
        }
      })
      .catch(() => {})
    const interval = setInterval(() => {
      fetch("/api/admin/notifications")
        .then(r => r.json())
        .then(data => {
          if (Array.isArray(data)) {
            setNotifications(data.slice(0, 10))
            setUnread(data.filter((n: any) => !n.read).length)
          }
        })
        .catch(() => {})
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const markRead = async (id: number) => {
    await fetch("/api/admin/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read: true }),
    })
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
    setUnread(Math.max(0, unread - 1))
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60 transition-all"
        title="Notificaciones"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-xl border border-zinc-800 bg-[#0f0f10] shadow-2xl shadow-black/40 overflow-hidden z-50">
          <div className="p-3 border-b border-zinc-800/60">
            <p className="text-sm font-semibold text-white">Notificaciones</p>
          </div>
          <div className="max-h-80 overflow-y-auto divide-y divide-zinc-800/40">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-zinc-500 text-xs">Sin notificaciones</div>
            ) : (
              notifications.map((n: any) => (
                <div
                  key={n.id}
                  className={`p-3 cursor-pointer transition-colors ${n.read ? "opacity-60" : "bg-emerald-500/5"}`}
                  onClick={() => { if (!n.read) markRead(n.id) }}
                >
                  <div className="flex items-start gap-2">
                    <span className={`text-xs mt-0.5 ${
                      n.type === "success" ? "text-emerald-400" :
                      n.type === "warning" ? "text-amber-400" :
                      n.type === "error" ? "text-red-400" : "text-zinc-400"
                    }`}>
                      {n.type === "success" ? "✓" : n.type === "warning" ? "!" : n.type === "error" ? "✕" : "○"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">{n.title}</p>
                      {n.body && <p className="text-[10px] text-zinc-500 mt-0.5 line-clamp-2">{n.body}</p>}
                      <p className="text-[9px] text-zinc-600 mt-1">
                        {n.created_at ? new Date(n.created_at).toLocaleDateString("es", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : ""}
                      </p>
                    </div>
                    {n.link && (
                      <Link href={n.link} className="text-[10px] text-emerald-400 hover:text-emerald-300 shrink-0">
                        Ver
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
