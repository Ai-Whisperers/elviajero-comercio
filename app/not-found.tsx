import Link from "next/link"
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <h1 className="mb-4 text-6xl font-bold text-primary">404</h1>
      <p className="mb-8 text-lg text-muted-foreground">Página no encontrada</p>
      <Link href="/" className="rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90">Volver al inicio</Link>
    </div>
  )
}
