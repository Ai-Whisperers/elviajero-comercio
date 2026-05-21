'use client'
import Link from "next/link"

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <>
<div className="flex min-h-[60vh] flex-col items-center justify-center bg-background px-4 text-center">
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="text-3xl font-bold text-foreground mb-3">Error del servidor</h1>
        <p className="text-muted-foreground mb-8">Algo salió mal. Intentalo de nuevo o volvé al inicio.</p>
        <div className="flex gap-4">
          <button onClick={reset} className="rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground hover:bg-primary/90">
            Intentar de nuevo
          </button>
          <Link href="/" className="rounded-lg border border-border px-8 py-3 font-semibold text-foreground hover:bg-muted">
            Volver al inicio
          </Link>
        </div>
      </div>
</>
  )
}
