import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"

// ── Scoped system prompt — El Viajero context only ──
const SYSTEM_PROMPT = `Eres el asistente de administración de El Viajero (tiendaelviajero.com.py).
Tu ÚNICO contexto es El Viajero — una tienda de camping, pesca y accesorios outdoor en Mariano Roque Alonso, Paraguay.

PROPIETARIO: Omar
WHATSAPP: 595984009751
UBICACIÓN: Mariano Roque Alonso, Central, Paraguay
FUNDADO: 2025
PRODUCTOS: camping, pesca, accesorios para auto/moto, equipo outdoor (~35+ productos)
SITIO: Next.js 15 + Supabase + Docker Swarm en VPS

REGLAS:
- Respondé SIEMPRE en español
- Solo hablás de El Viajero, sus productos, y su sitio web
- Si te preguntan sobre otros clientes, proyectos, o datos externos, respondé: "Solo tengo contexto de El Viajero"
- Ayudás con: editar contenido del sitio, descripciones de productos, respuestas a clientes, SEO, ideas de marketing
- No tenés acceso a modificar el sitio directamente — sugerí cambios que el admin puede hacer desde el panel
- Para cambios técnicos (código, deploy), explicá qué hay que hacer paso a paso

FORMATO: Respuestas concisas y directas. Máximo 3 párrafos salvo que pidan detalle.`

const LLM_BASE_URL = process.env.ASSISTANT_LLM_BASE_URL || "https://api.openai.com/v1"
const LLM_API_KEY = process.env.ASSISTANT_LLM_API_KEY || ""
const LLM_MODEL = process.env.ASSISTANT_LLM_MODEL || "gpt-4o-mini"

interface ChatMessage {
  role: "system" | "user" | "assistant"
  content: string
}

export async function POST(req: NextRequest) {
  const { error: authError } = await requireAdmin(req)
  if (authError) return authError

  if (!LLM_API_KEY) {
    return NextResponse.json(
      { error: "Asistente no configurado. Falta ASSISTANT_LLM_API_KEY en el servidor." },
      { status: 503 }
    )
  }

  let messages: ChatMessage[]
  try {
    const body = await req.json()
    messages = body.messages || []
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "messages es requerido" }, { status: 400 })
  }

  // Enforce scope: prepend system prompt, cap history
  const scopedMessages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...messages.slice(-20), // Keep last 20 messages max
  ]

  try {
    const response = await fetch(`${LLM_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LLM_API_KEY}`,
      },
      body: JSON.stringify({
        model: LLM_MODEL,
        messages: scopedMessages,
        max_tokens: 1024,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errText = await response.text().catch(() => "Unknown error")
      console.error("[assistant] LLM error:", response.status, errText)
      return NextResponse.json(
        { error: `Error del modelo AI (${response.status})` },
        { status: 502 }
      )
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content || "Sin respuesta del modelo."

    return NextResponse.json({ reply })
  } catch (err) {
    console.error("[assistant] fetch error:", err)
    return NextResponse.json(
      { error: "No se pudo conectar al modelo AI" },
      { status: 502 }
    )
  }
}
