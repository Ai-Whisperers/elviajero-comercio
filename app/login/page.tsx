"use client"
import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      const users = JSON.parse(localStorage.getItem("viajero-users") || "[]")
      const user = users.find((u: any) => u.email === email && u.password === password)
      if (user) {
        localStorage.setItem("viajero-session", JSON.stringify({ email: user.email, name: user.name }))
        window.location.href = "/"
      } else {
        setError("Email o contraseña incorrectos")
      }
    } catch {
      setError("Error al iniciar sesión")
    }
  }

  return (
    <>
      <Header />
      <section className="flex min-h-[60vh] items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-8 shadow-sm">
          <h1 className="mb-6 text-2xl font-bold text-foreground">Iniciar Sesión</h1>
          {error && <p className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="email" placeholder="tu@email.com" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-input bg-background px-4 py-3 text-foreground outline-none focus:border-ring"
              required
            />
            <input
              type="password" placeholder="Contraseña" value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-input bg-background px-4 py-3 text-foreground outline-none focus:border-ring"
              required
            />
            <button type="submit" className="rounded-lg bg-primary py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90">
              Ingresar
            </button>
            <p className="text-center text-sm text-muted-foreground">
              ¿No tenés cuenta?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Registrate
              </Link>
            </p>
          </form>
        </div>
      </section>
      <Footer />
    </>
  )
}
