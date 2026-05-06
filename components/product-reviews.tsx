"use client"
import { getReviews, addReview } from "@/lib/reviews"
import { useAuth } from "@ai-whisperers/auth/auth-context"
import { useState, useEffect } from "react"

export function ProductReviews({ productName }: { productName: string }) {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<any[]>([])
  const [rating, setRating] = useState(0)
  const [text, setText] = useState("")
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => { setReviews(getReviews(productName)) }, [productName])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!rating || !text.trim()) return
    addReview({ productName, userName: user?.name || "Anónimo", rating, text: text.trim() })
    setReviews(getReviews(productName))
    setRating(0)
    setText("")
    setSubmitted(true)
  }

  const avg = reviews.reduce((s, r) => s + r.rating, 0) / (reviews.length || 1)

  return (
    <section className="mt-12">
      <h2 className="mb-2 text-xl font-bold text-foreground">Opiniones</h2>
      {reviews.length > 0 && (
        <p className="mb-6 text-sm text-muted-foreground">
          {reviews.length} opinión{reviews.length > 1 ? "es" : ""} · ★ {avg.toFixed(1)} / 5
        </p>
      )}

      <div className="space-y-4 mb-8">
        {reviews.length === 0 && (
          <p className="text-sm text-muted-foreground">No hay opiniones todavía. ¡Sé el primero!</p>
        )}
        {reviews.map((r) => (
          <div key={r.id} className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex gap-0.5 text-amber-400 text-sm">
                {Array.from({ length: 5 }).map((_, i) => <span key={i}>{i < r.rating ? "★" : "☆"}</span>)}
              </div>
              <span className="text-xs font-medium text-foreground">{r.userName}</span>
              <span className="text-xs text-muted-foreground">{new Date(r.date).toLocaleDateString("es")}</span>
            </div>
            <p className="text-sm text-muted-foreground">{r.text}</p>
          </div>
        ))}
      </div>

      {!submitted && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-surface p-5">
          <h3 className="mb-3 text-sm font-semibold text-foreground">Dejá tu opinión</h3>
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" onClick={() => setRating(n)} className={`text-xl transition-all ${n <= rating ? "text-amber-400 scale-110" : "text-muted"}`}>
                {n <= rating ? "★" : "☆"}
              </button>
            ))}
          </div>
          <textarea value={text} onChange={e => setText(e.target.value)} rows={2} placeholder="¿Qué te pareció?" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring resize-none mb-3" />
          <button type="submit" disabled={!rating || !text.trim()} className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
            Publicar opinión
          </button>
        </form>
      )}
      {submitted && <p className="text-sm text-success">¡Gracias por tu opinión!</p>}
    </section>
  )
}
