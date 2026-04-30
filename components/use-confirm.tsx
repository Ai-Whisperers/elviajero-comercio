
"use client"
import { useState, useCallback } from "react"

interface ConfirmOptions { title: string; message: string; confirmText?: string; cancelText?: string; variant?: "danger" | "primary" }

export function useConfirm() {
  const [state, setState] = useState<ConfirmOptions | null>(null)
  const [resolve, setResolve] = useState<((v: boolean) => void) | null>(null)

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    return new Promise((res) => {
      setState(opts)
      setResolve(() => res)
    })
  }, [])

  const handleResult = (result: boolean) => {
    resolve?.(result)
    setState(null)
  }

  const dialog = state ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => handleResult(false)}>
      <div className="max-w-sm rounded-2xl bg-surface p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-foreground mb-2">{state.title}</h3>
        <p className="text-sm text-muted-foreground mb-6">{state.message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => handleResult(false)} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">{state.cancelText || "Cancelar"}</button>
          <button onClick={() => handleResult(true)} className={"rounded-lg px-4 py-2 text-sm font-semibold text-white " + (state.variant === "danger" ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90")}>
            {state.confirmText || "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  ) : null

  return { confirm, dialog }
}
