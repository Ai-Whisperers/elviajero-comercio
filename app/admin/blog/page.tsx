"use client"
import { AdminShell, useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"
import Link from "next/link"
import { PageHeader, SearchInput, EmptyState, Badge, TableSkeleton } from "@/components/admin/ui"

type Post = { slug: string; title: string; excerpt: string; content: string; category: string; image_url: string; author: string; published: boolean; created_at: string }

function slugify(text: string) { return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").slice(0, 60) }

export default function AdminBlog() {
  const { authed } = useAdminAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<Post>({ slug: "", title: "", excerpt: "", content: "", category: "general", image_url: "", author: "", published: false, created_at: new Date().toISOString().split("T")[0] })

  useEffect(() => {
    if (!authed) return
    load()
  }, [authed])

  const load = async () => {
    setLoading(true)
    const res = await fetch("/api/admin/blog")
    if (res.ok) setPosts(await res.json())
    setLoading(false)
  }

  const save = async () => {
    setSaving(true)
    if (!form.slug) form.slug = slugify(form.title)
    const method = editing ? "PATCH" : "POST"
    const res = await fetch("/api/admin/blog", {
      method, headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing ? { ...form, original_slug: editing } : form),
    })
    if (res.ok) { setShowForm(false); setEditing(null); setForm({ slug: "", title: "", excerpt: "", content: "", category: "general", image_url: "", author: "", published: false, created_at: new Date().toISOString().split("T")[0] }); load() }
    setSaving(false)
  }

  const remove = async (slug: string) => {
    if (!confirm("¿Eliminar este post?")) return
    await fetch("/api/admin/blog?slug=" + slug, { method: "DELETE" })
    load()
  }

  const categories = ["general", "camping", "pesca", "outdoor", "consejos"]

  const filtered = search
    ? posts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
    : posts

  if (!authed) return null

  return (
    <>
      <PageHeader
        title={"Blog (" + posts.length + ")"}
        subtitle="Administrar artículos del blog"
        actions={
          <div className="flex items-center gap-3">
            <SearchInput value={search} onChange={setSearch} placeholder="Buscar posts..." />
            <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ slug: "", title: "", excerpt: "", content: "", category: "general", image_url: "", author: "", published: false, created_at: new Date().toISOString().split("T")[0] }) }}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition-all">
              {showForm ? "Cancelar" : "+ Nuevo post"}
            </button>
          </div>
        }
      />

      {showForm && (
        <div className="mb-6 rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white">{editing ? "Editar post" : "Nuevo post"}</h3>
          <div className="grid grid-cols-2 gap-4">
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value, slug: editing ? form.slug : slugify(e.target.value) })} placeholder="Título"
              className="rounded-lg border border-zinc-700/60 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50" />
            <input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} placeholder="Slug (URL)"
              className="rounded-lg border border-zinc-700/60 bg-zinc-800 px-3 py-2 text-sm text-zinc-400 outline-none focus:border-emerald-500/50" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
              className="rounded-lg border border-zinc-700/60 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input value={form.author} onChange={e => setForm({...form, author: e.target.value})} placeholder="Autor"
              className="rounded-lg border border-zinc-700/60 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50" />
            <input type="date" value={form.created_at} onChange={e => setForm({...form, created_at: e.target.value})}
              className="rounded-lg border border-zinc-700/60 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50" />
          </div>
          <input value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} placeholder="URL de imagen (opcional)"
            className="w-full rounded-lg border border-zinc-700/60 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50" />
          <textarea value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} placeholder="Extracto (breve descripción)" rows={2}
            className="w-full rounded-lg border border-zinc-700/60 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50" />
          <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} placeholder="Contenido completo (markdown o HTML)" rows={8}
            className="w-full rounded-lg border border-zinc-700/60 bg-zinc-800 px-3 py-2 text-sm text-white font-mono outline-none focus:border-emerald-500/50" />
          <label className="flex items-center gap-2 text-sm text-zinc-400">
            <input type="checkbox" checked={form.published} onChange={e => setForm({...form, published: e.target.checked})} className="text-emerald-600" />
            Publicado (visible en el sitio)
          </label>
          <button onClick={save} disabled={saving || !form.title}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 transition-all">
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      )}

      {loading ? (
        <TableSkeleton rows={4} cols={1} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          }
          title={search ? "Sin resultados" : "Sin posts todavía"}
          description={search ? "Probá con otro término" : "Creá tu primer artículo del blog"}
          actions={!search ? <button onClick={() => setShowForm(true)} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500">Crear post</button> : undefined}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map(p => (
            <div key={p.slug} className="flex items-center justify-between rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4 hover:border-zinc-700/60 transition-all">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white truncate">{p.title}</h3>
                  <Badge status={p.published ? "published" : "draft"}>{p.published ? "Publicado" : "Borrador"}</Badge>
                </div>
                <p className="text-xs text-zinc-500 mt-1">{p.category} · {p.created_at?.slice(0, 10)} · /blog/{p.slug}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-4">
                <Link href={"/blog/" + p.slug} target="_blank" className="text-xs text-blue-400 hover:underline">Ver</Link>
                <button onClick={() => { setForm(p); setEditing(p.slug); setShowForm(true) }} className="text-xs text-amber-400 hover:underline">Editar</button>
                <button onClick={() => remove(p.slug)} className="text-xs text-red-400 hover:underline">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
