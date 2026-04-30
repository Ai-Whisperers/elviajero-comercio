
"use client"
import { useState } from "react"

export function FeedbackButton() {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState("")
  const [sent, setSent] = useState(false)

  const submit = () => {
    if (!text.trim()) return
    const feedbacks: any[] = JSON.parse(localStorage.getItem("viajero_feedback") || "[]")
    feedbacks.push({ id: Date.now().toString(36), text: text.trim(), date: new Date().toISOString(), url: window.location.href })
    localStorage.setItem("viajero_feedback", JSON.stringify(feedbacks))
    setSent(true)
    setTimeout(() => { setOpen(false); setSent(false); setText("") }, 2000)
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="fixed bottom-20 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl text-white shadow-lg hover:bg-primary/90 transition-all md:bottom-6" aria-label="Enviar feedback">
        💭
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            {sent ? (
              <div className="text-center py-4"><div className="text-4xl mb-2">✅</div><p className="font-medium text-foreground">¡Gracias por tu feedback!</p></div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-foreground mb-2">Decinos qué mejorar</h3>
                <textarea value={text} onChange={e => setText(e.target.value)} rows={3} placeholder="Tu opinión nos ayuda a mejorar..." className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring resize-none mb-4" />
                <button onClick={submit} disabled={!text.trim()} className="w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50">Enviar</button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
