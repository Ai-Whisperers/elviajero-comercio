
"use client"
import { useState, useEffect } from "react"
import { useAuth } from "@ai-whisperers/auth/auth-context"

interface QA { id: string; productName: string; userName: string; question: string; answer?: string; answerDate?: string; date: string }

const STORAGE = "viajero_questions"

export function ProductFAQ({ productName }: { productName: string }) {
  const { user } = useAuth()
  const [items, setItems] = useState<QA[]>([])
  const [question, setQuestion] = useState("")
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const all: QA[] = JSON.parse(localStorage.getItem(STORAGE) || "[]")
    setItems(all.filter(q => q.productName === productName))
  }, [productName])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return
    const all: QA[] = JSON.parse(localStorage.getItem(STORAGE) || "[]")
    const q: QA = { id: Date.now().toString(36), productName, userName: user?.name || "Anónimo", question: question.trim(), date: new Date().toISOString() }
    all.push(q)
    localStorage.setItem(STORAGE, JSON.stringify(all))
    setItems([...items, q])
    setQuestion("")
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="mt-12">
      <h2 className="mb-6 text-xl font-bold text-foreground">Preguntas y respuestas</h2>
      <div className="space-y-4 mb-8">
        {items.length === 0 && <p className="text-sm text-muted-foreground">No hay preguntas todavía.</p>}
        {items.map((q) => (
          <div key={q.id} className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm text-primary">Q</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{q.question}</p>
                <p className="text-xs text-muted-foreground mt-1">{q.userName} · {new Date(q.date).toLocaleDateString("es")}</p>
              </div>
            </div>
            {q.answer && (
              <div className="mt-3 flex items-start gap-3 border-t border-border pt-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground">A</div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{q.answer}</p>
                  <p className="text-xs text-muted-foreground mt-1">El Viajero · {q.answerDate ? new Date(q.answerDate).toLocaleDateString("es") : ""}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={submit} className="rounded-xl border border-border bg-surface p-5">
        <h3 className="mb-3 text-sm font-semibold text-foreground">Hacé tu pregunta</h3>
        <textarea value={question} onChange={e => setQuestion(e.target.value)} rows={2} placeholder="Escribí tu pregunta sobre este producto..." className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring resize-none mb-3" />
        <button type="submit" disabled={!question.trim()} className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50">Enviar pregunta</button>
        {submitted && <span className="ml-3 text-sm text-success">Pregunta enviada</span>}
      </form>
    </div>
  )
}
