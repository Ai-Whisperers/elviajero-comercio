"use client"
import { useState } from "react"

function Input({ label, value, onChange, multiline, placeholder }: {
  label: string
  value: string
  onChange: (v: string) => void
  multiline?: boolean
  placeholder?: string
}) {
  const id = label.replace(/\s+/g, "-").toLowerCase()
  return (
    <div className="mb-3">
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-zinc-400">{label}</label>
      {multiline ? (
        <textarea id={id} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-zinc-700/60 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50 min-h-[80px]" />
      ) : (
        <input id={id} type="text" value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-zinc-700/60 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50" />
      )}
    </div>
  )
}

/** Deep get value from an object by dot path */
function deepGet(obj: any, path: string): string {
  const parts = path.split(".")
  let cur = obj
  for (const p of parts) {
    if (cur?.[p] === undefined || cur?.[p] === null) return ""
    cur = cur[p]
  }
  return typeof cur === "string" ? cur : typeof cur === "number" ? String(cur) : ""
}

/** Deep set value on a cloned object */
function deepSet(obj: any, path: string, value: any): any {
  const parts = path.split(".")
  const clone = JSON.parse(JSON.stringify(obj))
  let cur = clone
  for (let i = 0; i < parts.length - 1; i++) {
    if (!cur[parts[i]]) cur[parts[i]] = {}
    cur = cur[parts[i]]
  }
  cur[parts[parts.length - 1]] = value
  return clone
}

interface EditableSectionProps {
  section: string
  overrides: any
  defaultContent: any
  onChange: (path: string, value: any) => void
  onAddItem: (path: string, template: any) => void
  onRemoveItem: (path: string, index: number) => void
  onUpdateArrayItem: (path: string, index: number, field: string, value: string) => void
  getArray: (path: string) => any[]
  get: (path: string) => string
}

export function EditableSection({
  section, overrides, defaultContent, onChange, onAddItem, onRemoveItem, onUpdateArrayItem, getArray, get,
}: EditableSectionProps) {
  return (
    <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-6">
      {section === "general" && (
        <div className="space-y-4">
          <Input label="Nombre del sitio" value={get("siteName")} onChange={v => onChange("siteName", v)} placeholder={deepGet(defaultContent, "siteName")} />
          <Input label="Tagline" value={get("tagline")} onChange={v => onChange("tagline", v)} placeholder={deepGet(defaultContent, "tagline")} />
          <Input label="WhatsApp number" value={get("whatsapp.number")} onChange={v => onChange("whatsapp.number", v)} placeholder={deepGet(defaultContent, "whatsapp.number") || process.env.NEXT_PUBLIC_WHATSAPP || "595984009751"} />
          <Input label="WhatsApp message" multiline value={get("whatsapp.message")} onChange={v => onChange("whatsapp.message", v)} />
        </div>
      )}

      {section === "hero" && (
        <div className="space-y-4">
          <Input label="Título principal (H1)" value={get("home.hero.headline")} onChange={v => onChange("home.hero.headline", v)} placeholder={deepGet(defaultContent, "home.hero.headline")} />
          <Input label="Subtítulo" multiline value={get("home.hero.subheadline")} onChange={v => onChange("home.hero.subheadline", v)} placeholder={deepGet(defaultContent, "home.hero.subheadline")} />
          <Input label="Texto del botón primario" value={get("home.hero.ctaPrimaryText")} onChange={v => onChange("home.hero.ctaPrimaryText", v)} placeholder={deepGet(defaultContent, "home.hero.ctaPrimaryText")} />
          <Input label="Link del botón primario" value={get("home.hero.ctaPrimaryHref")} onChange={v => onChange("home.hero.ctaPrimaryHref", v)} />
          <Input label="Texto del botón secundario" value={get("home.hero.ctaSecondaryText")} onChange={v => onChange("home.hero.ctaSecondaryText", v)} placeholder={deepGet(defaultContent, "home.hero.ctaSecondaryText")} />
          <Input label="Link del botón secundario" value={get("home.hero.ctaSecondaryHref")} onChange={v => onChange("home.hero.ctaSecondaryHref", v)} />
        </div>
      )}

      {section === "about" && (
        <div className="space-y-4">
          <Input label="Título" value={get("about.hero.title")} onChange={v => onChange("about.hero.title", v)} placeholder={deepGet(defaultContent, "about.hero.title")} />
          <Input label="Subtítulo" multiline value={get("about.hero.subtitle")} onChange={v => onChange("about.hero.subtitle", v)} placeholder={deepGet(defaultContent, "about.hero.subtitle")} />
          <Input label="Historia (párrafo 1)" multiline value={get("about.story.p1")} onChange={v => onChange("about.story.p1", v)} placeholder={deepGet(defaultContent, "about.story.p1")} />
          <Input label="Historia (párrafo 2)" multiline value={get("about.story.p2")} onChange={v => onChange("about.story.p2", v)} placeholder={deepGet(defaultContent, "about.story.p2")} />
          <Input label="Historia (párrafo 3)" multiline value={get("about.story.p3")} onChange={v => onChange("about.story.p3", v)} placeholder={deepGet(defaultContent, "about.story.p3")} />
        </div>
      )}

      {section === "contacto" && (
        <div className="space-y-4">
          <Input label="Dirección" value={get("contacto.info.address")} onChange={v => onChange("contacto.info.address", v)} placeholder={deepGet(defaultContent, "contacto.info.address")} />
          <Input label="Teléfono" value={get("contacto.info.phone")} onChange={v => onChange("contacto.info.phone", v)} placeholder={deepGet(defaultContent, "contacto.info.phone")} />
          <Input label="Email" value={get("contacto.info.email")} onChange={v => onChange("contacto.info.email", v)} placeholder={deepGet(defaultContent, "contacto.info.email")} />
          <Input label="Horarios" value={get("contacto.info.hours")} onChange={v => onChange("contacto.info.hours", v)} placeholder={deepGet(defaultContent, "contacto.info.hours")} />
        </div>
      )}

      {section === "footer" && (
        <div className="space-y-4">
          <Input label="Descripción" multiline value={get("footer.description")} onChange={v => onChange("footer.description", v)} placeholder={deepGet(defaultContent, "footer.description")} />
          <Input label="Dirección" value={get("footer.address")} onChange={v => onChange("footer.address", v)} placeholder={deepGet(defaultContent, "footer.address")} />
          <Input label="Teléfono" value={get("footer.phone")} onChange={v => onChange("footer.phone", v)} placeholder={deepGet(defaultContent, "footer.phone")} />
          <Input label="Horarios" value={get("footer.hours")} onChange={v => onChange("footer.hours", v)} placeholder={deepGet(defaultContent, "footer.hours")} />
        </div>
      )}

      {section === "faq" && (
        <div>
          <p className="mb-4 text-sm text-zinc-400">Preguntas frecuentes — se muestran en /faq</p>
          {(getArray("faq.items").length > 0 ? getArray("faq.items") : defaultContent.faq?.items || []).map((item: any, i: number) => (
            <div key={i} className="mb-4 rounded-lg border border-zinc-700/60 bg-zinc-800 p-4">
              <Input label={`Pregunta ${i + 1}`} value={item.question || ""} onChange={v => onUpdateArrayItem("faq.items", i, "question", v)} placeholder={deepGet(defaultContent.faq?.items?.[i], "question")} />
              <Input label={`Respuesta ${i + 1}`} multiline value={item.answer || ""} onChange={v => onUpdateArrayItem("faq.items", i, "answer", v)} placeholder={deepGet(defaultContent.faq?.items?.[i], "answer")} />
              <button onClick={() => onRemoveItem("faq.items", i)} className="text-xs text-red-400 hover:underline">Eliminar</button>
            </div>
          ))}
          <button onClick={() => onAddItem("faq.items", { question: "", answer: "" })}
            className="mt-2 rounded-lg border border-dashed border-zinc-600 px-4 py-2 text-sm text-zinc-400 hover:text-white hover:border-zinc-600">
            + Agregar pregunta
          </button>
        </div>
      )}

      {section === "testimonials" && (
        <div>
          <p className="mb-4 text-sm text-zinc-400">Testimonios de clientes — se muestran en la home</p>
          {(getArray("home.testimonials.items").length > 0 ? getArray("home.testimonials.items") : defaultContent.home?.testimonials?.items || []).map((item: any, i: number) => (
            <div key={i} className="mb-4 rounded-lg border border-zinc-700/60 bg-zinc-800 p-4">
              <Input label="Nombre" value={item.name || ""} onChange={v => onUpdateArrayItem("home.testimonials.items", i, "name", v)} placeholder={deepGet(defaultContent.home?.testimonials?.items?.[i], "name")} />
              <Input label="Texto" multiline value={item.text || ""} onChange={v => onUpdateArrayItem("home.testimonials.items", i, "text", v)} placeholder={deepGet(defaultContent.home?.testimonials?.items?.[i], "text")} />
              <button onClick={() => onRemoveItem("home.testimonials.items", i)} className="text-xs text-red-400 hover:underline">Eliminar</button>
            </div>
          ))}
          <button onClick={() => onAddItem("home.testimonials.items", { name: "", text: "", rating: 5 })}
            className="mt-2 rounded-lg border border-dashed border-zinc-600 px-4 py-2 text-sm text-zinc-400 hover:text-white hover:border-zinc-600">
            + Agregar testimonio
          </button>
        </div>
      )}

      {section === "stats" && (
        <div>
          <p className="mb-4 text-sm text-zinc-400">Estadísticas en la home</p>
          <Input label="Título de la sección" value={get("home.stats.title")} onChange={v => onChange("home.stats.title", v)} placeholder={deepGet(defaultContent, "home.stats.title")} />
          {(getArray("home.stats.items").length > 0 ? getArray("home.stats.items") : defaultContent.home?.stats?.items || []).map((item: any, i: number) => (
            <div key={i} className="mb-3 flex items-center gap-3 rounded-lg border border-zinc-700/60 bg-zinc-800 p-3">
              <Input label={`Valor ${i + 1}`} value={item.value || ""} onChange={v => onUpdateArrayItem("home.stats.items", i, "value", v)} placeholder={deepGet(defaultContent.home?.stats?.items?.[i], "value")} />
              <Input label={`Etiqueta ${i + 1}`} value={item.label || ""} onChange={v => onUpdateArrayItem("home.stats.items", i, "label", v)} placeholder={deepGet(defaultContent.home?.stats?.items?.[i], "label")} />
              <button onClick={() => onRemoveItem("home.stats.items", i)} className="text-xs text-red-400 shrink-0">✕</button>
            </div>
          ))}
          <button onClick={() => onAddItem("home.stats.items", { value: "", label: "" })}
            className="mt-2 rounded-lg border border-dashed border-zinc-600 px-4 py-2 text-sm text-zinc-400 hover:text-white">
            + Agregar estadística
          </button>
        </div>
      )}

      {section === "seo" && (
        <div className="space-y-4">
          <p className="text-sm text-zinc-400">Meta tags para SEO — aparecen en &lt;title&gt; y &lt;meta description&gt;</p>
          <Input label="Home: Title" value={get("home.seo.title")} onChange={v => onChange("home.seo.title", v)} placeholder={deepGet(defaultContent, "home.seo.title")} />
          <Input label="Home: Description" multiline value={get("home.seo.description")} onChange={v => onChange("home.seo.description", v)} placeholder={deepGet(defaultContent, "home.seo.description")} />
          <Input label="Tienda: Title" value={get("tienda.seo.title")} onChange={v => onChange("tienda.seo.title", v)} placeholder={deepGet(defaultContent, "tienda.seo.title")} />
          <Input label="Tienda: Description" multiline value={get("tienda.seo.description")} onChange={v => onChange("tienda.seo.description", v)} placeholder={deepGet(defaultContent, "tienda.seo.description")} />
        </div>
      )}

      {section === "features" && (
        <div>
          <p className="mb-4 text-sm text-zinc-400">Características / ventajas competitivas</p>
          <Input label="Título de la sección" value={get("home.features.title")} onChange={v => onChange("home.features.title", v)} placeholder={deepGet(defaultContent, "home.features.title")} />
          {(getArray("home.features.items").length > 0 ? getArray("home.features.items") : defaultContent.home?.features?.items || []).map((item: any, i: number) => (
            <div key={i} className="mb-4 rounded-lg border border-zinc-700/60 bg-zinc-800 p-4">
              <Input label={`Título ${i + 1}`} value={item.title || ""} onChange={v => onUpdateArrayItem("home.features.items", i, "title", v)} placeholder={deepGet(defaultContent.home?.features?.items?.[i], "title")} />
              <Input label={`Descripción ${i + 1}`} multiline value={item.description || ""} onChange={v => onUpdateArrayItem("home.features.items", i, "description", v)} placeholder={deepGet(defaultContent.home?.features?.items?.[i], "description")} />
              <button onClick={() => onRemoveItem("home.features.items", i)} className="text-xs text-red-400 hover:underline">Eliminar</button>
            </div>
          ))}
          <button onClick={() => onAddItem("home.features.items", { title: "", description: "" })}
            className="mt-2 rounded-lg border border-dashed border-zinc-600 px-4 py-2 text-sm text-zinc-400 hover:text-white">
            + Agregar característica
          </button>
        </div>
      )}
    </div>
  )
}
