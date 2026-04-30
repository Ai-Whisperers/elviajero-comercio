"use client"
import { createContext, useContext, useState, useCallback } from "react"

type ToastType = "success" | "error" | "info"

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastCtx {
  toast: (msg: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastCtx>({ toast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }, [])

  const remove = (id: string) => setToasts(prev => prev.filter(t => t.id !== id))

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-20 left-1/2 z-50 flex -translate-x-1/2 flex-col gap-2 md:bottom-6 md:right-6 md:left-auto md:translate-x-0">
        {toasts.map(t => (
          <div key={t.id}
            onClick={() => remove(t.id)}
            className={`animate-slide-up flex cursor-pointer items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-lg backdrop-blur-sm ${
              t.type === "success" ? "bg-success/90 text-white" :
              t.type === "error" ? "bg-destructive/90 text-white" :
              "bg-foreground/90 text-background"
            }`}>
            <span>{t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}</span>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
