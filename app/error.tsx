'use client'
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="text-6xl mb-6">⚠️</div>
      <h1 className="text-3xl font-bold text-foreground mb-3">Error del servidor</h1>
      <p className="text-muted-foreground mb-8">Algo sali\u00f3 mal.</p>
      <button onClick={reset} className="rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground hover:bg-primary/90">Intentar de nuevo</button>
    </div>
  )
}
