"use client"
export const dynamic = "force-dynamic"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@ai-whisperers/auth/supabase/client"

function ResetForm() {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Supabase handles the token verification via the URL hash automatically
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) setError("Link inválido o expirado. Solicitá uno nuevo.")
    })
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (password.length < 6) { setError("Mínimo 6 caracteres"); return }
    if (password !== confirm) { setError("Las contraseñas no coinciden"); return }
    
    setLoading(true)
    const { error: err } = await supabase.auth.updateUser({ password })
    setLoading(false)
    
    if (err) { setError(err.message); return }
    setDone(true)
    setTimeout(() => router.push("/login"), 2000)
  }

  if (done) return (
    <section className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center"><div className="text-5xl mb-4">✅</div><h1 className="text-xl font-bold">Contraseña actualizada</h1></div>
    </section>
  )

  return (
    <>
<section className="flex min-h-[70vh] items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm">
          <h1 className="mb-6 text-center text-2xl font-bold text-foreground">Nueva contraseña</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} placeholder="Nueva contraseña" className="w-full rounded-lg border border-input bg-surface px-4 py-3 text-sm outline-none focus:border-ring" />
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required minLength={6} placeholder="Confirmar" className="w-full rounded-lg border border-input bg-surface px-4 py-3 text-sm outline-none focus:border-ring" />
            <button type="submit" disabled={loading} className="w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
              {loading ? "Actualizando..." : "Restablecer"}
            </button>
          </form>
        </div>
      </section>
</>
  )
}

export default function ResetPage() { return <ResetForm /> }
