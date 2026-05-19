import { useState, useCallback } from "react"

export interface Toast {
  id: string
  type: "success" | "error" | "info"
  message: string
}

export function useToast(timeout = 4000) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((type: Toast["type"], message: string) => {
    const id = Math.random().toString(36).slice(2, 9)
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, timeout)
  }, [timeout])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return { toasts, addToast, removeToast }
}
