
import content from "@/content/es.json"
import Link from "next/link"
import Image from "next/image"

const c = content as any
const allPosts = c.blog?.posts || []
const categories = [...new Set(allPosts.map((p: any) => p.category || "General").filter(Boolean))]

export function generateStaticParams() {
  return categories.map((cat) => ({ category: (cat as string).toLowerCase().replace(/[^a-z]/g, "") }))
}

export default async function BlogCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const catName = categories.find((c: any) => (c as string).toLowerCase().replace(/[^a-z]/g, "") === category) as string || category
  const posts = allPosts.filter((p: any) => (p.category || "General").toLowerCase().replace(/[^a-z]/g, "") === category)

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8">
        <Link href="/blog" className="text-sm text-primary hover:underline">&larr; Todos los artículos</Link>
        <h1 className="mt-2 text-3xl font-bold text-foreground">{catName}</h1>
        <p className="mt-1 text-muted-foreground">{posts.length} artículo{posts.length > 1 ? "s" : ""}</p>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post: any, i: number) => (
          <Link key={i} href={"/blog/" + post.slug} className="group rounded-xl border border-border bg-surface overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md">
            {post.image && <Image src={post.image} alt={post.title} width={600} height={338} className="aspect-video w-full object-cover transition-transform group-hover:scale-105" />}
            <div className="p-4"><p className="text-xs text-muted-foreground">{post.date} &middot; {post.category}</p><h2 className="mt-1 font-semibold text-foreground group-hover:text-primary">{post.title}</h2></div>
          </Link>
        ))}
      </div>
    </div>
  )
}
