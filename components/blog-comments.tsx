"use client"
import { useState, useEffect } from "react"
import { useAuth } from "@ai-whisperers/auth/auth-context"
interface C { id: string; postSlug: string; userName: string; text: string; date: string }
const KEY = "viajero_blog_comments"
export function BlogComments({ postSlug }: { postSlug: string }) {
  const { user } = useAuth()
  const [comments, setComments] = useState<C[]>([])
  const [text, setText] = useState("")
  useEffect(() => { const all: C[] = JSON.parse(localStorage.getItem(KEY) || "[]"); setComments(all.filter(c => c.postSlug === postSlug)) }, [postSlug])
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    const all: C[] = JSON.parse(localStorage.getItem(KEY) || "[]")
    all.push({ id: Date.now().toString(36), postSlug, userName: user?.name || "Anonimo", text: text.trim(), date: new Date().toISOString() })
    localStorage.setItem(KEY, JSON.stringify(all))
    setComments(all.filter(c => c.postSlug === postSlug)); setText("")
  }
  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold text-foreground mb-4">Comentarios ({comments.length})</h3>
      <div className="space-y-4 mb-6">
        {comments.length === 0 && <p className="text-sm text-muted-foreground">No hay comentarios.</p>}
        {comments.slice(-10).reverse().map(c => (
          <div key={c.id} className="rounded-lg border border-border bg-surface p-4">
            <div className="flex items-center gap-2 mb-1"><span className="text-sm font-medium text-foreground">{c.userName}</span><span className="text-xs text-muted-foreground">{new Date(c.date).toLocaleDateString("es")}</span></div>
            <p className="text-sm text-muted-foreground">{c.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={submit} className="flex gap-3">
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Escribi un comentario..." className="flex-1 rounded-lg border border-input bg-surface px-4 py-2.5 text-sm outline-none focus:border-ring" />
        <button type="submit" disabled={!text.trim()} className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50">Enviar</button>
      </form>
    </div>
  )
}
