import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { name, current } = await req.json()
    if (!name) return NextResponse.json({ error: "name required" }, { status: 400 })

    // AI enrichment via Hermes API or fallback template
    const prompt = `Generá contenido SEO para un producto de camping/pesca/outdoor llamado "${name}". 
Devuelve SOLO JSON sin markdown: {
  "suggested_brand": "marca sugerida",
  "suggested_description": "descripción SEO de 2-3 líneas",
  "suggested_specs": "especificaciones técnicas",
  "suggested_weight": "peso estimado"
}`

    // Try to use an AI provider if configured
    try {
      const aiRes = await fetch(process.env.AI_ENRICH_URL || "http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: process.env.AI_ENRICH_MODEL || "llama3",
          prompt,
          stream: false,
        }),
      })
      if (aiRes.ok) {
        const aiData = await aiRes.json()
        try {
          const parsed = JSON.parse(aiData.response || aiData.text || "{}")
          return NextResponse.json(parsed)
        } catch {}
      }
    } catch {}

    // Fallback: return basic template
    const suggestions = {
      suggested_brand: current?.brand || "",
      suggested_description: current?.description || `${name} de alta calidad para tus aventuras al aire libre. Ideal para camping, pesca y actividades outdoor.`,
      suggested_specs: current?.specs || "Consultar especificaciones",
      suggested_weight: current?.weight || "",
    }

    return NextResponse.json(suggestions)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
