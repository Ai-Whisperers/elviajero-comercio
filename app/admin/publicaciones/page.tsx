"use client"
import { adminFetch } from "@/lib/admin-fetch"
import { useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"
import { PageHeader, EmptyState } from "@/components/admin/ui"

interface ScheduledPost {
  id: string
  title: string
  content: string
  type: "blog" | "promo" | "social"
  scheduled_at: string
  published: boolean
  platform?: string
}

export default function ScheduledPostsPage() {
  const { authed } = useAdminAuth()
  const [posts, setPosts] = useState<ScheduledPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Partial<ScheduledPost>>({
    type: "blog",
    scheduled_at: new Date().toISOString().slice(0, 16)
  })

  useEffect(() => {
    if (!authed) return
    adminFetch("/api/admin/scheduled-posts")
      .then(r => r.json())
      .then(data => { setPosts(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [authed])

  const save = async () => {
    const newPost: ScheduledPost = {
      id: crypto.randomUUID(),
      title: form.title || "Sin título",
      content: form.content || "",
      type: form.type || "blog",
      scheduled_at: form.scheduled_at || new Date().toISOString(),
      published: false,
      platform: form.platform
    }
    await adminFetch("/api/admin/scheduled-posts", {
      method: "POST",
      body: JSON.stringify(newPost)
    })
    setPosts([newPost, ...posts])
    setShowForm(false)
    setForm({ type: "blog", scheduled_at: new Date().toISOString().slice(0, 16) })
  }

  const togglePublished = async (id: string) => {
    const post = posts.find(p => p.id === id)
    if (!post) return
    const updated = { ...post, published: !post.published }
    await adminFetch("/api/admin/scheduled-posts", {
      method: "POST",
      body: JSON.stringify(updated)
    })
    setPosts(posts.map(p => p.id === id ? updated : p))
  }

  if (!authed) return null

  return (
    <>
      <PageHeader
        title="Publicaciones Programadas"
        subtitle={`${posts.filter(p => !p.published).length} pendientes`}
        actions={
          <button onClick={() => setShowForm(!showForm)} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500">
            {showForm ? "Cancelar" : "+ Nueva"}
          </button>
        }
      />

      {showForm && (
        <div className="mb-6 rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Nueva publicación</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Título</label>
              <input value={form.title || ""} onChange={e => setForm({...form, title: e.target.value})}
                className="w-full rounded-lg border border-zinc-700/60 bg-zinc-800 px-3 py-2 text-sm text-white" />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Tipo</label>
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value as any})}
                className="w-full rounded-lg border border-zinc-700/60 bg-zinc-800 px-3 py-2 text-sm text-white">
                <option value="blog">Blog</option>
                <option value="promo">Promoción</option>
                <option value="social">Red social</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Fecha y hora</label>
              <input type="datetime-local" value={form.scheduled_at || ""} onChange={e => setForm({...form, scheduled_at: e.target.value})}
                className="w-full rounded-lg border border-zinc-700/60 bg-zinc-800 px-3 py-2 text-sm text-white" />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Plataforma (opcional)</label>
              <input value={form.platform || ""} onChange={e => setForm({...form, platform: e.target.value})}
                placeholder="Instagram, Facebook, etc"
                className="w-full rounded-lg border border-zinc-700/60 bg-zinc-800 px-3 py-2 text-sm text-white" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-zinc-400 mb-1">Contenido</label>
              <textarea value={form.content || ""} onChange={e => setForm({...form, content: e.target.value})} rows={4}
                className="w-full rounded-lg border border-zinc-700/60 bg-zinc-800 px-3 py-2 text-sm text-white" />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={save} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500">Guardar</button>
            <button onClick={() => setShowForm(false)} className="rounded-lg border border-zinc-700/60 px-4 py-2 text-sm text-zinc-400 hover:text-white">Cancelar</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="animate-pulse space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-16 rounded-xl bg-zinc-800/50" />)}
        </div>
      ) : posts.length === 0 ? (
        <EmptyState icon={<span className="text-2xl">📅</span>} title="Sin publicaciones" description="Programá posts para blog, promos o redes sociales" />
      ) : (
        <div className="grid gap-3">
          {posts.sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime()).map(p => (
            <div key={p.id} className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-white truncate">{p.title}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${p.published ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}`}>
                    {p.published ? "Publicado" : "Pendiente"}
                  </span>
                  <span className="text-[10px] text-zinc-500 uppercase">{p.type}</span>
                </div>
                <p className="text-xs text-zinc-400 truncate">{p.content}</p>
                <p className="text-xs text-zinc-500 mt-1">
                  {new Date(p.scheduled_at).toLocaleString("es-PY")}
                  {p.platform && ` · ${p.platform}`}
                </p>
              </div>
              <button onClick={() => togglePublished(p.id)} className="text-xs text-zinc-400 hover:text-white shrink-0">
                {p.published ? "Marcar pendiente" : "Marcar publicado"}
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
