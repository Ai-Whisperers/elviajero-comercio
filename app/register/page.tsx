"use client"
import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (password !== confirm) {
      setError("Las contraseñas no coinciden")
      return
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }
    try {
      const users = JSON.parse(localStorage.getItem("viajero-users") || "[]")
      if (users.find((u: any) => u.email === email)) {
        setError("Este email ya está registrado")
        return
      }
      users.push({ name, email, password })
      localStorage.setItem("viajero-users", JSON.stringify(users))
      localStorage.setItem("viajero-session", JSON.stringify({ email, name }))
      window.location.href = "/"
    } catch {
      setError("Error al registrarse")
    }
  }

  return (
    <>
      <Header />
      <section className="flex min-h-[60vh] items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-8 shadow-sm">
          <h1 className="mb-6 text-2xl font-bold text-foreground">Crear Cuenta</h1>
          {error && <p className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <input
              type="text" placeholder="Nombre completo" value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border border-input bg-background px-4 py-3 text-foreground outline-none focus:border-ring"
              required
            />
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
            <input
              type="password" placeholder="Confirmar contraseña" value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="rounded-lg border border-input bg-background px-4 py-3 text-foreground outline-none focus:border-ring"
              required
            />
            <button type="submit" className="rounded-lg bg-primary py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90">
              Registrarse
            </button>
            <p className="text-center text-sm text-muted-foreground">
              ¿Ya tenés cuenta?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Iniciá sesión
              </Link>
            </p>
          </form>
        </div>
      </section>
      <Footer />
    </>
  )
}
