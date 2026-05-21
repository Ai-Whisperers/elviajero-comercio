"use client"
import { useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect, useCallback } from "react"
import defaultContentRaw from "@/content/es.json"
import { SectionNav, SECTIONS } from "@/components/admin/section-nav"
import { PageHeader } from "@/components/admin/ui"
import { ImageUpload } from "@/components/admin/image-upload"
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

  const updateArrayItem = (path: string, index: number, field: string | null, value: string | number) => {
    setOverrides((prev: any) => {
      const parts = path.split(".")
      const clone = JSON.parse(JSON.stringify(prev))
      let obj = clone
      for (let i = 0; i < parts.length - 1; i++) {
        if (!obj[parts[i]]) obj[parts[i]] = {}
        obj = obj[parts[i]]
      }
      const arr = [...(obj[parts[parts.length - 1]] || [])]
      if (field === "" || field === null) {
        arr[index] = value
      } else {
        if (!arr[index]) arr[index] = {}
        arr[index] = { ...arr[index], [field]: value }
      }
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
              <Input label="WhatsApp number" value={get("whatsapp.number")} onChange={v => set("whatsapp.number", v)} placeholder={deepGet(defaultContent, "whatsapp.number") || process.env.NEXT_PUBLIC_WHATSAPP || "595984009751"} />
              <Input label="WhatsApp message" multiline value={get("whatsapp.message")} onChange={v => set("whatsapp.message", v)} />
            </div>
          )}

          {section === "hero" && (
            <div className="space-y-6">
              <p className="text-sm text-zinc-400">Carrusel principal del hero en la home. Se muestran hasta 5 slides.</p>
              {(() => {
                const defaultSlides = defaultContent.home?.heroCarousel?.slides || []
                const overrideSlides = getArray("home.heroCarousel.slides")
                const slides = overrideSlides.length > 0 ? overrideSlides : defaultSlides
                return slides.map((_: any, i: number) => (
                  <div key={i} className="rounded-lg border border-zinc-700/60 bg-zinc-800/50 p-4">
                    <h3 className="text-sm font-semibold text-white mb-3">Slide {i + 1}</h3>
                    <Input label="Título" value={deepGet(overrideSlides[i] || defaultSlides[i] || {}, "title")} onChange={v => set(`home.heroCarousel.slides.${i}.title`, v)} placeholder={deepGet(defaultContent, `home.heroCarousel.slides.${i}.title`)} />
                    <Input label="Subtítulo" multiline value={deepGet(overrideSlides[i] || defaultSlides[i] || {}, "subtitle")} onChange={v => set(`home.heroCarousel.slides.${i}.subtitle`, v)} placeholder={deepGet(defaultContent, `home.heroCarousel.slides.${i}.subtitle`)} />
                    <ImageUpload label={`Imagen de fondo ${i + 1}`} currentUrl={deepGet(overrideSlides[i] || defaultSlides[i] || {}, "image") || undefined} onUpload={v => set(`home.heroCarousel.slides.${i}.image`, v)} />
                    <Input label="Texto botón" value={deepGet(overrideSlides[i] || defaultSlides[i] || {}, "ctaText")} onChange={v => set(`home.heroCarousel.slides.${i}.ctaText`, v)} placeholder={deepGet(defaultContent, `home.heroCarousel.slides.${i}.ctaText`)} />
                    <Input label="Link botón" value={deepGet(overrideSlides[i] || defaultSlides[i] || {}, "ctaHref")} onChange={v => set(`home.heroCarousel.slides.${i}.ctaHref`, v)} placeholder={deepGet(defaultContent, `home.heroCarousel.slides.${i}.ctaHref`)} />
                  </div>
                ))
              })()}
            </div>
          )}

          {section === "categories" && (
            <div>
              <p className="mb-4 text-sm text-zinc-400">Categorías que aparecen en la home y en la tienda. El orden aquí es el orden en que se muestran.</p>
              <p className="mb-4 text-xs text-zinc-500">Tip: usá nombres cortos para mejor visualización. Los productos se agrupan por estas categorías.</p>
              <p className="mb-6 text-xs text-emerald-400">Podés cambiar la imagen de cada categoría desde acá. Slug se genera automáticamente.</p>
              {(getArray("home.productCatalog.categories").length > 0 ? getArray("home.productCatalog.categories") : defaultContent.home?.productCatalog?.categories || []).map((item: string, i: number) => {
                const slug = item.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z]/g, "")
                return (
                <div key={i} className="mb-4 rounded-lg border border-zinc-700/60 bg-zinc-800 p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="text-xs text-zinc-500 w-6">{i + 1}</span>
                    <input
                      value={item}
                      onChange={e => updateArrayItem("home.productCatalog.categories", i, "", e.target.value)}
                      className="flex-1 rounded bg-zinc-900 px-3 py-2 text-sm text-white border border-zinc-700/60 focus:outline-none focus:border-emerald-500/50"
                    />
                    <button onClick={() => removeArrayItem("home.productCatalog.categories", i)} className="text-xs text-red-400 shrink-0">✕</button>
                  </div>
                  <ImageUpload label={`Imagen (slug: ${slug})`} currentUrl={get(`home.categoryImages.${slug}`) || undefined} onUpload={v => set(`home.categoryImages.${slug}`, v)} />
                </div>
              )})}
              <button onClick={() => addArrayItem("home.productCatalog.categories", "Nueva categoría")}
                className="mt-2 rounded-lg border border-dashed border-zinc-600 px-4 py-2 text-sm text-zinc-400 hover:text-white">
                + Agregar categoría
              </button>
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

          {section === "kits" && (
            <div>
              <p className="mb-4 text-sm text-zinc-400">Carrusel de kits y promociones en la home (debajo del hero)</p>
              <Input label="Título de la sección" value={get("home.kitsCarousel.title")} onChange={v => set("home.kitsCarousel.title", v)} placeholder={deepGet(defaultContent, "home.kitsCarousel.title")} />
              {(getArray("home.kitsCarousel.items").length > 0 ? getArray("home.kitsCarousel.items") : defaultContent.home?.kitsCarousel?.items || []).map((item: any, i: number) => (
                <div key={i} className="mb-4 rounded-lg border border-zinc-700/60 bg-zinc-800 p-4">
                  <Input label={`Título ${i + 1}`} value={item.title || ""} onChange={v => updateArrayItem("home.kitsCarousel.items", i, "title", v)} placeholder={deepGet(defaultContent.home?.kitsCarousel?.items?.[i], "title")} />
                  <Input label={`Descripción ${i + 1}`} multiline value={item.description || ""} onChange={v => updateArrayItem("home.kitsCarousel.items", i, "description", v)} />
                  <Input label={`Precio ${i + 1}`} value={item.price || ""} onChange={v => updateArrayItem("home.kitsCarousel.items", i, "price", v)} />
                  <Input label={`Precio anterior ${i + 1}`} value={item.priceBefore || ""} onChange={v => updateArrayItem("home.kitsCarousel.items", i, "priceBefore", v)} />
                  <Input label={`Badge ${i + 1}`} value={item.badge || ""} onChange={v => updateArrayItem("home.kitsCarousel.items", i, "badge", v)} placeholder="-15%, NUEVO, etc" />
                  <ImageUpload label={`Imagen ${i + 1}`} currentUrl={item.image || undefined} onUpload={v => updateArrayItem("home.kitsCarousel.items", i, "image", v)} />
                  <Input label={`WhatsApp text ${i + 1}`} value={item.whatsappText || ""} onChange={v => updateArrayItem("home.kitsCarousel.items", i, "whatsappText", v)} />
                  <button onClick={() => removeArrayItem("home.kitsCarousel.items", i)} className="mt-2 text-xs text-red-400 hover:underline">Eliminar kit</button>
                </div>
              ))}
              <button onClick={() => addArrayItem("home.kitsCarousel.items", { title: "", description: "", price: "", priceBefore: "", image: "", badge: "", whatsappText: "" })}
                className="mt-2 rounded-lg border border-dashed border-zinc-600 px-4 py-2 text-sm text-zinc-400 hover:text-white">
                + Agregar kit
              </button>
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
              <p className="text-sm text-zinc-400">Meta tags para SEO — aparecen en &lt;title&gt; y &lt;meta description&gt;</p>
              <Input label="Home: Title" value={get("home.seo.title")} onChange={v => set("home.seo.title", v)} placeholder={deepGet(defaultContent, "home.seo.title")} />
              <Input label="Home: Description" multiline value={get("home.seo.description")} onChange={v => set("home.seo.description", v)} placeholder={deepGet(defaultContent, "home.seo.description")} />
              <Input label="Tienda: Title" value={get("tienda.seo.title")} onChange={v => set("tienda.seo.title", v)} placeholder={deepGet(defaultContent, "tienda.seo.title")} />
              <Input label="Tienda: Description" multiline value={get("tienda.seo.description")} onChange={v => set("tienda.seo.description", v)} placeholder={deepGet(defaultContent, "tienda.seo.description")} />
              <Input label="Blog: Title" value={get("blog.title")} onChange={v => set("blog.title", v)} placeholder={deepGet(defaultContent, "blog.title")} />
              <Input label="Blog: Subtitle" value={get("blog.subtitle")} onChange={v => set("blog.subtitle", v)} placeholder={deepGet(defaultContent, "blog.subtitle")} />
              <Input label="Nosotros: Title" value={get("about.seo.title")} onChange={v => set("about.seo.title", v)} placeholder={deepGet(defaultContent, "about.seo.title")} />
              <Input label="Nosotros: Description" multiline value={get("about.seo.description")} onChange={v => set("about.seo.description", v)} placeholder={deepGet(defaultContent, "about.seo.description")} />
              <Input label="Contacto: Title" value={get("contacto.seo.title")} onChange={v => set("contacto.seo.title", v)} placeholder={deepGet(defaultContent, "contacto.seo.title")} />
              <Input label="Contacto: Description" multiline value={get("contacto.seo.description")} onChange={v => set("contacto.seo.description", v)} placeholder={deepGet(defaultContent, "contacto.seo.description")} />
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

          {section === "promociones" && (
            <div>
              <p className="mb-4 text-sm text-zinc-400">Página de Promociones — hero y listado de promos</p>
              <Input label="Título" value={get("promociones.hero.headline")} onChange={v => set("promociones.hero.headline", v)} placeholder={deepGet(defaultContent, "promociones.hero.headline")} />
              <Input label="Subtítulo" value={get("promociones.hero.subheadline")} onChange={v => set("promociones.hero.subheadline", v)} placeholder={deepGet(defaultContent, "promociones.hero.subheadline")} />
              <Input label="SEO Title" value={get("promociones.seo.title")} onChange={v => set("promociones.seo.title", v)} />
              <Input label="SEO Description" multiline value={get("promociones.seo.description")} onChange={v => set("promociones.seo.description", v)} />
              <h3 className="mt-6 mb-2 text-sm font-semibold text-zinc-300">Promociones</h3>
              {(getArray("promociones.promotions").length > 0 ? getArray("promociones.promotions") : defaultContent.promociones?.promotions || []).map((promo: any, i: number) => (
                <div key={i} className="mb-4 rounded-lg border border-zinc-700/60 bg-zinc-800 p-4">
                  <Input label={`Título ${i + 1}`} value={promo.title || ""} onChange={v => updateArrayItem("promociones.promotions", i, "title", v)} />
                  <Input label="Descripción" multiline value={promo.description || ""} onChange={v => updateArrayItem("promociones.promotions", i, "description", v)} />
                  <Input label="Badge" value={promo.badge || ""} onChange={v => updateArrayItem("promociones.promotions", i, "badge", v)} />
                  <div className="mt-2">
                    <label className="mb-1 block text-xs text-zinc-500">Imagen</label>
                    <ImageUpload currentUrl={promo.image || undefined} onUpload={v => updateArrayItem("promociones.promotions", i, "image", v)} />
                  </div>
                  <Input label="Texto del botón" value={promo.ctaText || ""} onChange={v => updateArrayItem("promociones.promotions", i, "ctaText", v)} />
                  <Input label="Link del botón" value={promo.ctaHref || ""} onChange={v => updateArrayItem("promociones.promotions", i, "ctaHref", v)} />
                  <button onClick={() => removeArrayItem("promociones.promotions", i)} className="text-xs text-red-400 hover:underline">Eliminar promo</button>
                </div>
              ))}
              <button onClick={() => addArrayItem("promociones.promotions", { title: "", description: "", badge: "", image: "", ctaText: "Ver más", ctaHref: "" })}
                className="mt-2 rounded-lg border border-dashed border-zinc-600 px-4 py-2 text-sm text-zinc-400 hover:text-white">
                + Agregar promoción
              </button>
            </div>
          )}

          {section === "navigation" && (
            <div>
              <p className="mb-4 text-sm text-zinc-400">Menú de navegación principal</p>
              <Input label="Nombre del negocio" value={get("navigation.businessName")} onChange={v => set("navigation.businessName", v)} />
              <Input label="Texto del botón CTA" value={get("navigation.ctaText")} onChange={v => set("navigation.ctaText", v)} />
              <Input label="Link del CTA" value={get("navigation.ctaHref")} onChange={v => set("navigation.ctaHref", v)} />
              <h3 className="mt-6 mb-2 text-sm font-semibold text-zinc-300">Items del menú</h3>
              {(getArray("navigation.items").length > 0 ? getArray("navigation.items") : defaultContent.navigation?.items || []).map((item: any, i: number) => (
                <div key={i} className="mb-3 flex gap-2 items-end">
                  <div className="flex-1">
                    <Input label={`Label ${i + 1}`} value={item.label || ""} onChange={v => updateArrayItem("navigation.items", i, "label", v)} />
                  </div>
                  <div className="flex-1">
                    <Input label="Href" value={item.href || ""} onChange={v => updateArrayItem("navigation.items", i, "href", v)} />
                  </div>
                  <button onClick={() => removeArrayItem("navigation.items", i)} className="mb-2 text-xs text-red-400 hover:underline">✕</button>
                </div>
              ))}
              <button onClick={() => addArrayItem("navigation.items", { label: "", href: "" })}
                className="mt-2 rounded-lg border border-dashed border-zinc-600 px-4 py-2 text-sm text-zinc-400 hover:text-white">
                + Agregar item
              </button>
            </div>
          )}

          {section === "storeLocator" && (
            <div>
              <p className="mb-4 text-sm text-zinc-400">Información del local físico</p>
              <Input label="Título" value={get("storeLocator.title")} onChange={v => set("storeLocator.title", v)} />
              <Input label="Descripción" multiline value={get("storeLocator.description")} onChange={v => set("storeLocator.description", v)} />
              <Input label="Dirección" value={get("storeLocator.address")} onChange={v => set("storeLocator.address", v)} />
              <Input label="Horarios" value={get("storeLocator.hours")} onChange={v => set("storeLocator.hours", v)} />
              <Input label="Google Maps URL" value={get("storeLocator.googleMapsUrl")} onChange={v => set("storeLocator.googleMapsUrl", v)} />
              <Input label="Texto del botón WhatsApp" value={get("storeLocator.whatsappText")} onChange={v => set("storeLocator.whatsappText", v)} />
              <Input label="Número WhatsApp" value={get("storeLocator.whatsappNumber")} onChange={v => set("storeLocator.whatsappNumber", v)} />
            </div>
          )}

          {section === "whatsapp" && (
            <div>
              <p className="mb-4 text-sm text-zinc-400">Configuración de WhatsApp Business</p>
              <Input label="Número de negocio" value={get("whatsapp.businessNumber")} onChange={v => set("whatsapp.businessNumber", v)} />
              <Input label="Link de negocio" value={get("whatsapp.businessLink")} onChange={v => set("whatsapp.businessLink", v)} />
              <Input label="Mensaje por defecto" multiline value={get("whatsapp.defaultMessage")} onChange={v => set("whatsapp.defaultMessage", v)} />
              <Input label="Mensaje de producto (usar {{productName}})" multiline value={get("whatsapp.serviceMessage")} onChange={v => set("whatsapp.serviceMessage", v)} />
            </div>
          )}

          {section === "shipping" && (
            <div>
              <p className="mb-4 text-sm text-zinc-400">Textos de la sección de envío</p>
              <Input label="Título" value={get("shipping.title")} onChange={v => set("shipping.title", v)} />
              <Input label="Envío a domicilio" value={get("shipping.delivery")} onChange={v => set("shipping.delivery", v)} />
              <Input label="Retiro en tienda" value={get("shipping.pickup")} onChange={v => set("shipping.pickup", v)} />
              <Input label="Gratis" value={get("shipping.free")} onChange={v => set("shipping.free", v)} />
              <Input label="Tiempo de entrega (label)" value={get("shipping.timing")} onChange={v => set("shipping.timing", v)} />
              <Input label="Tiempo de entrega (valor)" value={get("shipping.deliveryTime")} onChange={v => set("shipping.deliveryTime", v)} />
              <Input label="Envío a todo el país" value={get("shipping.fullCountry")} onChange={v => set("shipping.fullCountry", v)} />
            </div>
          )}

          {section === "deliveryZones" && (
            <div>
              <p className="mb-4 text-sm text-zinc-400">Zonas de entrega y costos de envío</p>
              {(getArray("deliveryZones").length > 0 ? getArray("deliveryZones") : defaultContent.deliveryZones || []).map((zone: any, i: number) => (
                <div key={i} className="mb-4 rounded-lg border border-zinc-700/60 bg-zinc-800 p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Zona" value={zone.zone || ""} onChange={v => updateArrayItem("deliveryZones", i, "zone", v)} />
                    <Input label="Costo (Gs.)" value={String(zone.fee ?? 0)} onChange={v => updateArrayItem("deliveryZones", i, "fee", Number(v))} />
                    <Input label="Mínimo para envío gratis (Gs.)" value={String(zone.minForFree ?? 0)} onChange={v => updateArrayItem("deliveryZones", i, "minForFree", Number(v))} />
                    <Input label="Tiempo de entrega" value={zone.days || ""} onChange={v => updateArrayItem("deliveryZones", i, "days", v)} />
                  </div>
                  <button onClick={() => removeArrayItem("deliveryZones", i)} className="mt-2 text-xs text-red-400 hover:underline">Eliminar zona</button>
                </div>
              ))}
              <button onClick={() => addArrayItem("deliveryZones", { zone: "", fee: 0, minForFree: 0, days: "" })}
                className="mt-2 rounded-lg border border-dashed border-zinc-600 px-4 py-2 text-sm text-zinc-400 hover:text-white">
                + Agregar zona
              </button>
            </div>
          )}

          {section === "paymentMethods" && (
            <div>
              <p className="mb-4 text-sm text-zinc-400">Medios de pago aceptados</p>
              <Input label="Cuotas" value={get("paymentMethods.installments")} onChange={v => set("paymentMethods.installments", v)} />
              <Input label="Nota" value={get("paymentMethods.note")} onChange={v => set("paymentMethods.note", v)} />
              <h3 className="mt-4 mb-2 text-sm font-semibold text-zinc-300">Iconos de medios de pago</h3>
              {(getArray("paymentMethods.icons").length > 0 ? getArray("paymentMethods.icons") : defaultContent.paymentMethods?.icons || []).map((icon: string, i: number) => (
                <div key={i} className="mb-2 flex gap-2 items-center">
                  <input
                    className="flex-1 rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-white"
                    value={icon || ""}
                    onChange={e => updateArrayItem("paymentMethods.icons", i, null, e.target.value)}
                  />
                  <button onClick={() => removeArrayItem("paymentMethods.icons", i)} className="text-xs text-red-400 hover:underline">✕</button>
                </div>
              ))}
              <button onClick={() => addArrayItem("paymentMethods.icons", "")}
                className="mt-2 rounded-lg border border-dashed border-zinc-600 px-4 py-2 text-sm text-zinc-400 hover:text-white">
                + Agregar icono
              </button>
            </div>
          )}

          {section === "cookieConsent" && (
            <div>
              <p className="mb-4 text-sm text-zinc-400">Banner de consentimiento de cookies</p>
              <label className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  checked={String(get("cookieConsent.enabled")) === "true"}
                  onChange={e => set("cookieConsent.enabled", e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-zinc-300">Mostrar banner de cookies</span>
              </label>
              <Input label="Mensaje" multiline value={get("cookieConsent.message")} onChange={v => set("cookieConsent.message", v)} />
              <Input label="Texto del botón aceptar" value={get("cookieConsent.acceptText")} onChange={v => set("cookieConsent.acceptText", v)} />
              <Input label="Texto 'Más información'" value={get("cookieConsent.moreInfoText")} onChange={v => set("cookieConsent.moreInfoText", v)} />
              <Input label="Link 'Más información'" value={get("cookieConsent.moreInfoLink")} onChange={v => set("cookieConsent.moreInfoLink", v)} />
            </div>
          )}

          {section === "newsletter" && (
            <div>
              <p className="mb-4 text-sm text-zinc-400">Formulario de newsletter</p>
              <Input label="Endpoint" value={get("newsletter.endpoint")} onChange={v => set("newsletter.endpoint", v)} />
              <Input label="Nombre de la lista" value={get("newsletter.listName")} onChange={v => set("newsletter.listName", v)} />
            </div>
          )}

          {section === "blog" && (
            <div>
              <p className="mb-4 text-sm text-zinc-400">Configuración del blog</p>
              <Input label="Título" value={get("blog.title")} onChange={v => set("blog.title", v)} />
              <Input label="Subtítulo" value={get("blog.subtitle")} onChange={v => set("blog.subtitle", v)} />
              <Input label="Texto 'Leer más'" value={get("blog.readMore")} onChange={v => set("blog.readMore", v)} />
              <Input label="Texto sin artículos" value={get("blog.noPosts")} onChange={v => set("blog.noPosts", v)} />
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
