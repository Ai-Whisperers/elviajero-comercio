"use client"
import { adminFetch } from "@/lib/admin-fetch"
import { useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Trash2, AlertTriangle, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/admin/ui"

interface Message {
  role: "user" | "assistant"
  content: string
}

function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === "user"
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? "bg-emerald-600/20" : "bg-zinc-800"}`}>
        {isUser ? <User className="w-4 h-4 text-emerald-400" /> : <Bot className="w-4 h-4 text-zinc-400" />}
      </div>
      <div className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
        isUser
          ? "bg-emerald-600 text-white rounded-br-sm"
          : "bg-zinc-800 text-zinc-200 rounded-bl-sm border border-zinc-700/50"
      }`}>
        {message.content}
      </div>
    </div>
  )
}

export default function AsistentePage() {
  const { authed } = useAdminAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  // Focus input on mount
  useEffect(() => {
    if (authed) inputRef.current?.focus()
  }, [authed])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return

    setError("")
    setInput("")
    setMessages(prev => [...prev, { role: "user", content: text }])
    setLoading(true)

    try {
      const res = await adminFetch("/api/admin/assistant", {
        method: "POST",
        body: JSON.stringify({ messages: [...messages, { role: "user", content: text }] })
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Error desconocido")
        setLoading(false)
        return
      }

      setMessages(prev => [...prev, { role: "assistant", content: data.reply }])
    } catch {
      setError("Error de conexión")
    }
    setLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([])
    setError("")
  }

  if (!authed) return null

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      <PageHeader
        title="Asistente AI"
        subtitle="Ayuda con contenido, productos y marketing de El Viajero"
        actions={
          messages.length > 0 && (
            <button
              onClick={clearChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Limpiar
            </button>
          )
        }
      />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto rounded-xl border border-zinc-800/60 bg-zinc-900/30 p-4 space-y-4 mb-4">
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Bot className="w-12 h-12 text-zinc-700 mb-3" />
            <p className="text-sm text-zinc-500 mb-1">Asistente de El Viajero</p>
            <p className="text-xs text-zinc-600 max-w-sm">
              Preguntame sobre productos, descripciones, respuestas a clientes,
              SEO, o cualquier cambio en el sitio.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 justify-center max-w-md">
              {[
                "Escribí una descripción para un kit de pesca",
                "¿Cómo mejoro el SEO de la home?",
                "Redactá una respuesta para un cliente que pregunta por carpas",
                "Sugerí 3 promociones para fin de semana",
              ].map(q => (
                <button
                  key={q}
                  onClick={() => { setInput(q); inputRef.current?.focus() }}
                  className="px-3 py-1.5 rounded-lg border border-zinc-700/50 bg-zinc-800/50 text-xs text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => <ChatBubble key={i} message={m} />)}

        {loading && (
          <div className="flex gap-3">
            <div className="shrink-0 w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
              <Bot className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="rounded-xl px-4 py-3 bg-zinc-800 border border-zinc-700/50 rounded-bl-sm">
              <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 px-3 py-2 mb-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          {error}
          <button onClick={() => setError("")} className="ml-auto text-red-500 hover:text-red-300">&times;</button>
        </div>
      )}

      {/* Input */}
      <div className="flex items-end gap-3">
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribí tu consulta..."
            rows={1}
            className="w-full rounded-xl border border-zinc-700/60 bg-zinc-800/80 px-4 py-3 pr-12 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-emerald-500/50 resize-none transition-colors"
            style={{ minHeight: "46px", maxHeight: "120px" }}
            disabled={loading}
          />
        </div>
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="shrink-0 w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
