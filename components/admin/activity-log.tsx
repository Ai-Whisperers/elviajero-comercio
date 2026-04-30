
"use client"
import { useState, useEffect } from "react"

interface LogEntry { id: string; action: string; detail: string; user: string; date: string }

const KEY = "viajero_admin_log"

export function logAction(action: string, detail: string) {
  try {
    const logs: LogEntry[] = JSON.parse(localStorage.getItem(KEY) || "[]")
    logs.unshift({ id: Date.now().toString(36), action, detail, user: "admin", date: new Date().toISOString() })
    if (logs.length > 200) logs.length = 200
    localStorage.setItem(KEY, JSON.stringify(logs))
  } catch {}
}

export function ActivityLog({ max = 20 }: { max?: number }) {
  const [logs, setLogs] = useState<LogEntry[]>([])
  useEffect(() => {
    const all: LogEntry[] = JSON.parse(localStorage.getItem(KEY) || "[]")
    setLogs(all.slice(0, max))
  }, [max])

  return (
    <div className="space-y-1">
      {logs.length === 0 && <p className="text-sm text-gray-500">Sin actividad registrada</p>}
      {logs.map((l) => (
        <div key={l.id} className="flex items-start gap-2 rounded-lg bg-gray-800/50 px-3 py-2 text-xs">
          <span className="text-gray-500 shrink-0">{new Date(l.date).toLocaleDateString("es", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
          <span className="text-gray-300">{l.action}</span>
          <span className="text-gray-500 truncate">{l.detail}</span>
        </div>
      ))}
    </div>
  )
}
