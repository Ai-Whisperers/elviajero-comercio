"use client"
import { useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect, useCallback } from "react"
import defaultContentRaw from "@/content/es.json"
import { SectionNav, SECTIONS } from "@/components/admin/section-nav"
import { PageHeader } from "@/components/admin/ui"
const defaultContent: any = defaultContentRaw

function Input({ label, value, onChange, multiline, placeholder }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean; placeholder?: string }) {
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

function deepGet(obj: any, path: string): string {
  const parts = path.split(".")
  let cur = obj
  for (const p of parts) {
    if (cur?.[p] === undefined || cur?.[p] === null) return ""
    cur = cur[p]
  }
  return typeof cur === "string" ? cur : typeof cur === "number" ? String(cur) : ""
}

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

function ContentEditor() {
  const { authed } = useAdminAuth()
  const [section, setSection] = useState("general")
  const [overrides, setOverrides] = useState<any>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!authed) return
    fetch("/api/admin/content").then(r => r.json()).then(d => { if (d) setOverrides(d) })
  }, [authed])

  const merged = { ...defaultContent, ...overrides }
  const get = (path: string) => {
    const v = deepGet(overrides, path)
    return v || deepGet(defaultContent, path)
  }
  const set = (path: string, value: any) => {
    setOverrides((prev: any) => deepSet(prev, path, value))
  }

  const save = async () => {
    setSaving(true)
    const res = await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(overrides),
    })
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000) }
    setSaving(false)
  }

  const addArrayItem = (path: string, template: any) => {
    setOverrides((prev: any) => {
      const parts = path.split(".")
      const clone = JSON.parse(JSON.stringify(prev))
      let obj = clone
      for (let i = 0; i < parts.length - 1; i++) {
        if (!obj[parts[i]]) obj[parts[i]] = {}
        obj = obj[parts[i]]
      }
      const arr = obj[parts[parts.length - 1]] || []
      obj[parts[parts.length - 1]] = [...arr, template]
      return clone
    })
  }

  const removeArrayItem = (path: string, index: number) => {
    setOverrides((prev: any) => {
      const parts = path.split(".")
      const clone = JSON.parse(JSON.stringify(prev))
      let obj = clone
      for (let i = 0; i < parts.length - 1; i++) {
        if (!obj[parts[i]]) return prev
        obj = obj[parts[i]]
      }
      const arr = obj[parts[parts.length - 1]]
      if (Array.isArray(arr)) {
        obj[parts[parts.length - 1]] = arr.filter((_: any, i: number) => i !== index)
      }
      return clone
    })
  }

  const updateArrayItem = (path: string, index: number, field: string, value: string) => {
    setOverrides((prev: any) => {
      const parts = path.split(".")
      const clone = JSON.parse(JSON.stringify(prev))
      let obj = clone
      for (let i = 0; i < parts.length - 1; i++) {
        if (!obj[parts[i]]) obj[parts[i]] = {}
        obj = obj[parts[i]]
      }
      const arr = [...(obj[parts[parts.length - 1]] || [])]
      if (!arr[index]) arr[index] = {}
      arr[index] = { ...arr[index], [field]: value }
      obj[parts[parts.length - 1]] = arr
      return clone
    })
  }

  const getArray = (path: string): any[] => {
    const parts = path.split(".")
    let cur = overrides
    for (const p of parts) {
      if (cur?.[p] === undefined) {
        let def: any = defaultContent
        for (const pp of parts) {
          if (def?.[pp] === undefined) return []
          def = def[pp]
        }
        return Array.isArray(def) ? def : []
      }
      cur = cur[p]
    }
    return Array.isArray(cur) ? cur : []
  }

  if (!authed) return null

  return (
    <div className="flex gap-6">
      <SectionNav sections={SECTIONS} active={section} onChange={setSection} />

      <div className="flex-1">
        <PageHeader
          title={SECTIONS.find(s => s.key === section)?.label || "Contenido"}
          subtitle="Editá el contenido de tu sitio"
          actions={
            <div className="flex items-center gap-3">
              {saved && <span className="text-xs text-emerald-400">✓ Guardado</span>}
              <button onClick={save} disabled={saving}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 transition-all">
                {saving ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          }
        />

        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-6">
          {section === "general" && (
            <div className="space-y-4">
              <Input label="Nombre del sitio" value={get("siteName")} onChange={v => set("siteName", v)} placeholder={deepGet(defaultContent, "siteName")} />
              <Input label="Razón social" value={get("businessName")} onChange={v => set("businessName", v)} placeholder={deepGet(defaultContent, "businessName")} />
              <Input label="Tagline" value={get("tagline")} onChange={v => set("tagline", v)} placeholder={deepGet(defaultContent, "tagline")} />
              <Input label="WhatsApp number" value={get("whatsapp.number")} onChange={v => set("whatsapp.number", v)} placeholder={deepGet(defaultContent, "whatsapp.number") || "595981234567"} />
              <Input label="WhatsApp message" multiline value={get("whatsapp.message")} onChange={v => set("whatsapp.message", v)} />
            </div>
          )}

          {section === "hero" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">Slide principal</h3>
                <Input label="Título principal (H1)" value={get("home.heroCarousel.slides.0.headline")} onChange={v => set("home.heroCarousel.slides.0.headline", v)} placeholder={deepGet(defaultContent, "home.heroCarousel.slides.0.headline")} />
                <Input label="Subtítulo" multiline value={get("home.heroCarousel.slides.0.subheadline")} onChange={v => set("home.heroCarousel.slides.0.subheadline", v)} placeholder={deepGet(defaultContent, "home.heroCarousel.slides.0.subheadline")} />
                <Input label="Imagen de fondo (URL)" value={get("home.heroCarousel.slides.0.image")} onChange={v => set("home.heroCarousel.slides.0.image", v)} placeholder={deepGet(defaultContent, "home.heroCarousel.slides.0.image")} />
                <Input label="Texto botón primario" value={get("home.heroCarousel.slides.0.ctaPrimaryText")} onChange={v => set("home.heroCarousel.slides.0.ctaPrimaryText", v)} placeholder={deepGet(defaultContent, "home.heroCarousel.slides.0.ctaPrimaryText")} />
                <Input label="Link botón primario" value={get("home.heroCarousel.slides.0.ctaPrimaryHref")} onChange={v => set("home.heroCarousel.slides.0.ctaPrimaryHref", v)} />
                <Input label="Texto botón secundario" value={get("home.heroCarousel.slides.0.ctaSecondaryText")} onChange={v => set("home.heroCarousel.slides.0.ctaSecondaryText", v)} placeholder={deepGet(defaultContent, "home.heroCarousel.slides.0.ctaSecondaryText")} />
                <Input label="Link botón secundario" value={get("home.heroCarousel.slides.0.ctaSecondaryHref")} onChange={v => set("home.heroCarousel.slides.0.ctaSecondaryHref", v)} />
              </div>
            </div>
          )}

          {section === "about" && (
            <div className="space-y-4">
              <Input label="Título" value={get("about.hero.title")} onChange={v => set("about.hero.title", v)} placeholder={deepGet(defaultContent, "about.hero.title")} />
              <Input label="Subtítulo" multiline value={get("about.hero.subtitle")} onChange={v => set("about.hero.subtitle", v)} placeholder={deepGet(defaultContent, "about.hero.subtitle")} />
              <div>
                <p className="mb-2 text-xs font-medium text-zinc-400">Párrafos de la historia</p>
                {(() => {
                  const defaultParas = defaultContent.about?.story?.paragraphs || []
                  const overrideParas = getArray("about.story.paragraphs")
                  const paragraphs = overrideParas.length > 0 ? overrideParas : defaultParas
                  return paragraphs.map((p: any, i: number) => (
                    <div key={i} className="mb-2">
                      <Input label={`Párrafo ${i + 1}`} multiline value={typeof p === 'string' ? p : p.text || ''} onChange={v => set(`about.story.paragraphs.${i}`, v)} placeholder="" />
                      <button onClick={() => removeArrayItem("about.story.paragraphs", i)} className="text-xs text-red-400 hover:underline mt-1">Eliminar</button>
                    </div>
                  ))
                })()}
                <button onClick={() => addArrayItem("about.story.paragraphs", "")}
                  className="mt-2 rounded-lg border border-dashed border-zinc-600 px-4 py-2 text-sm text-zinc-400 hover:text-white hover:border-zinc-600">
                  + Agregar párrafo
                </button>
              </div>
              <div>
                <p className="mb-2 text-xs font-medium text-zinc-400">Valores de la empresa</p>
                {(getArray("about.values").length > 0 ? getArray("about.values") : defaultContent.about?.values || []).map((v: any, i: number) => (
                  <div key={i} className="mb-3 rounded-lg border border-zinc-700/60 bg-zinc-800 p-3">
                    <Input label={`Título ${i + 1}`} value={v.title || ""} onChange={val => updateArrayItem("about.values", i, "title", val)} placeholder="" />
                    <Input label={`Descripción ${i + 1}`} multiline value={v.description || ""} onChange={val => updateArrayItem("about.values", i, "description", val)} placeholder="" />
                    <button onClick={() => removeArrayItem("about.values", i)} className="text-xs text-red-400 hover:underline">Eliminar</button>
                  </div>
                ))}
                <button onClick={() => addArrayItem("about.values", { title: "", description: "" })}
                  className="mt-2 rounded-lg border border-dashed border-zinc-600 px-4 py-2 text-sm text-zinc-400 hover:text-white hover:border-zinc-600">
                  + Agregar valor
                </button>
              </div>
            </div>
          )}

          {section === "contacto" && (
            <div className="space-y-4">
              <Input label="Dirección" value={get("contacto.info.address")} onChange={v => set("contacto.info.address", v)} placeholder={deepGet(defaultContent, "contacto.info.address")} />
              <Input label="Teléfono" value={get("contacto.info.phone")} onChange={v => set("contacto.info.phone", v)} placeholder={deepGet(defaultContent, "contacto.info.phone")} />
              <Input label="Email" value={get("contacto.info.email")} onChange={v => set("contacto.info.email", v)} placeholder={deepGet(defaultContent, "contacto.info.email")} />
              <Input label="Horarios" value={get("contacto.info.hours")} onChange={v => set("contacto.info.hours", v)} placeholder={deepGet(defaultContent, "contacto.info.hours")} />
            </div>
          )}

          {section === "footer" && (
            <div className="space-y-4">
              <Input label="Descripción" multiline value={get("footer.description")} onChange={v => set("footer.description", v)} placeholder={deepGet(defaultContent, "footer.description")} />
              <Input label="Dirección" value={get("footer.address")} onChange={v => set("footer.address", v)} placeholder={deepGet(defaultContent, "footer.address")} />
              <Input label="Teléfono" value={get("footer.phone")} onChange={v => set("footer.phone", v)} placeholder={deepGet(defaultContent, "footer.phone")} />
              <Input label="Horarios" value={get("footer.hours")} onChange={v => set("footer.hours", v)} placeholder={deepGet(defaultContent, "footer.hours")} />
            </div>
          )}

          {section === "faq" && (
            <div>
              <Input label="Título de sección FAQ" value={get("faq.hero.headline")} onChange={v => set("faq.hero.headline", v)} placeholder={deepGet(defaultContent, "faq.hero.headline")} />
              <Input label="Subtítulo FAQ" value={get("faq.hero.subheadline")} onChange={v => set("faq.hero.subheadline", v)} placeholder={deepGet(defaultContent, "faq.hero.subheadline")} />
              <div className="mt-6">
                <p className="mb-4 text-sm text-zinc-400">Preguntas frecuentes</p>
                {(getArray("faq.items").length > 0 ? getArray("faq.items") : defaultContent.faq?.items || []).map((item: any, i: number) => (
                  <div key={i} className="mb-4 rounded-lg border border-zinc-700/60 bg-zinc-800 p-4">
                    <Input label={`Pregunta ${i + 1}`} value={item.question || ""} onChange={v => updateArrayItem("faq.items", i, "question", v)} placeholder={deepGet(defaultContent.faq?.items?.[i], "question")} />
                    <Input label={`Respuesta ${i + 1}`} multiline value={item.answer || ""} onChange={v => updateArrayItem("faq.items", i, "answer", v)} placeholder={deepGet(defaultContent.faq?.items?.[i], "answer")} />
                    <button onClick={() => removeArrayItem("faq.items", i)} className="text-xs text-red-400 hover:underline">Eliminar</button>
                  </div>
                ))}
                <button onClick={() => addArrayItem("faq.items", { question: "", answer: "" })}
                  className="mt-2 rounded-lg border border-dashed border-zinc-600 px-4 py-2 text-sm text-zinc-400 hover:text-white hover:border-zinc-600">
                  + Agregar pregunta
                </button>
              </div>
            </div>
          )}

          {section === "testimonials" && (
            <div>
              <p className="mb-4 text-sm text-zinc-400">Testimonios de clientes — se muestran en la home</p>
              {(getArray("home.testimonials.items").length > 0 ? getArray("home.testimonials.items") : defaultContent.home?.testimonials?.items || []).map((item: any, i: number) => (
                <div key={i} className="mb-4 rounded-lg border border-zinc-700/60 bg-zinc-800 p-4">
                  <Input label="Nombre" value={item.name || ""} onChange={v => updateArrayItem("home.testimonials.items", i, "name", v)} placeholder={deepGet(defaultContent.home?.testimonials?.items?.[i], "name")} />
                  <Input label="Texto" multiline value={item.text || ""} onChange={v => updateArrayItem("home.testimonials.items", i, "text", v)} placeholder={deepGet(defaultContent.home?.testimonials?.items?.[i], "text")} />
                  <button onClick={() => removeArrayItem("home.testimonials.items", i)} className="text-xs text-red-400 hover:underline">Eliminar</button>
                </div>
              ))}
              <button onClick={() => addArrayItem("home.testimonials.items", { name: "", text: "", rating: 5 })}
                className="mt-2 rounded-lg border border-dashed border-zinc-600 px-4 py-2 text-sm text-zinc-400 hover:text-white hover:border-zinc-600">
                + Agregar testimonio
              </button>
            </div>
          )}

          {section === "stats" && (
            <div>
              <p className="mb-4 text-sm text-zinc-400">Estadísticas en la home</p>
              <Input label="Título de la sección" value={get("home.stats.title")} onChange={v => set("home.stats.title", v)} placeholder={deepGet(defaultContent, "home.stats.title")} />
              {(getArray("home.stats.items").length > 0 ? getArray("home.stats.items") : defaultContent.home?.stats?.items || []).map((item: any, i: number) => (
                <div key={i} className="mb-3 flex items-center gap-3 rounded-lg border border-zinc-700/60 bg-zinc-800 p-3">
                  <Input label={`Valor ${i + 1}`} value={item.value || ""} onChange={v => updateArrayItem("home.stats.items", i, "value", v)} placeholder={deepGet(defaultContent.home?.stats?.items?.[i], "value")} />
                  <Input label={`Etiqueta ${i + 1}`} value={item.label || ""} onChange={v => updateArrayItem("home.stats.items", i, "label", v)} placeholder={deepGet(defaultContent.home?.stats?.items?.[i], "label")} />
                  <button onClick={() => removeArrayItem("home.stats.items", i)} className="text-xs text-red-400 shrink-0">✕</button>
                </div>
              ))}
              <button onClick={() => addArrayItem("home.stats.items", { value: "", label: "" })}
                className="mt-2 rounded-lg border border-dashed border-zinc-600 px-4 py-2 text-sm text-zinc-400 hover:text-white">
                + Agregar estadística
              </button>
            </div>
          )}

          {section === "seo" && (
            <div className="space-y-4">
              <p className="text-sm text-zinc-400">Meta tags para SEO — aparecen en &lt;title&gt; y &lt;meta description&gt; (requiere rebuild para actualizar)</p>
              <Input label="Home: Title" value={get("home.seo.title")} onChange={v => set("home.seo.title", v)} placeholder={deepGet(defaultContent, "home.seo.title")} />
              <Input label="Home: Description" multiline value={get("home.seo.description")} onChange={v => set("home.seo.description", v)} placeholder={deepGet(defaultContent, "home.seo.description")} />
              <Input label="Tienda: Title" value={get("tienda.seo.title")} onChange={v => set("tienda.seo.title", v)} placeholder={deepGet(defaultContent, "tienda.seo.title")} />
              <Input label="Tienda: Description" multiline value={get("tienda.seo.description")} onChange={v => set("tienda.seo.description", v)} placeholder={deepGet(defaultContent, "tienda.seo.description")} />
            </div>
          )}

          {section === "features" && (
            <div>
              <p className="mb-4 text-sm text-zinc-400">Características / ventajas competitivas</p>
              <Input label="Título de la sección" value={get("home.features.title")} onChange={v => set("home.features.title", v)} placeholder={deepGet(defaultContent, "home.features.title")} />
              {(getArray("home.features.items").length > 0 ? getArray("home.features.items") : defaultContent.home?.features?.items || []).map((item: any, i: number) => (
                <div key={i} className="mb-4 rounded-lg border border-zinc-700/60 bg-zinc-800 p-4">
                  <Input label={`Título ${i + 1}`} value={item.title || ""} onChange={v => updateArrayItem("home.features.items", i, "title", v)} placeholder={deepGet(defaultContent.home?.features?.items?.[i], "title")} />
                  <Input label={`Descripción ${i + 1}`} multiline value={item.description || ""} onChange={v => updateArrayItem("home.features.items", i, "description", v)} placeholder={deepGet(defaultContent.home?.features?.items?.[i], "description")} />
                  <button onClick={() => removeArrayItem("home.features.items", i)} className="text-xs text-red-400 hover:underline">Eliminar</button>
                </div>
              ))}
              <button onClick={() => addArrayItem("home.features.items", { title: "", description: "" })}
                className="mt-2 rounded-lg border border-dashed border-zinc-600 px-4 py-2 text-sm text-zinc-400 hover:text-white">
                + Agregar característica
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ContentPage() {
  return <ContentEditor />
}
