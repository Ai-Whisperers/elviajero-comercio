import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import content from "@/content/es.json"
import Image from "next/image"

const c = content as any
const blog = (c.home?.blog || c.tienda?.blog || {})
const posts = blog.index?.posts || []
const categories = blog.index?.categories || []

export default function BlogPage() {
  return (<><Header />
    <section className="bg-primary py-12 text-center text-primary-foreground"><h1 className="text-4xl font-bold">{blog.hero?.headline || "Blog"}</h1><p className="mt-2 text-primary-foreground/80">{blog.hero?.subheadline}</p></section>

    {categories.length > 0 && <section className="bg-surface-light py-8"><div className="mx-auto max-w-7xl px-4"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{categories.map((cat:any,i:number)=>(
      <div key={i} className="overflow-hidden rounded-xl border border-border bg-white shadow-sm"><div className="aspect-video bg-muted overflow-hidden">{cat.image && <img src={cat.image} alt={cat.name} className="h-full w-full object-cover" />}</div><div className="p-4"><h3 className="font-semibold text-foreground">{cat.name}</h3><p className="text-xs text-muted-foreground">{cat.description}</p></div></div>
    ))}</div></div></section>}

    <section className="bg-background py-16"><div className="mx-auto max-w-7xl px-4">
      <h2 className="mb-8 text-2xl font-bold text-foreground">{blog.index?.title || "Todas las guías"}</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post:any,i:number)=>(
          <Link key={i} href={`/blog/${post.slug}`} className="group overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
            <div className="aspect-video bg-muted overflow-hidden">{post.image && <img src={post.image} alt={post.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />}</div>
            <div className="p-5">
              <div className="mb-2 flex items-center gap-2 text-xs"><span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">{post.category}</span><span className="text-muted-foreground">{post.date}</span></div>
              <h3 className="mb-2 font-semibold text-foreground group-hover:text-primary">{post.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div></section>

    <Footer />
  </>)
}
