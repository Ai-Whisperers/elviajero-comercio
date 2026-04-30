import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import content from "@/content/es.json"
import Link from "next/link"
import { notFound } from "next/navigation"

const c = content as any
const posts = (c.home?.blog?.index?.posts || c.tienda?.blog?.index?.posts || [])

export default async function BlogPost(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const post = posts.find((p:any) => p.slug === slug)
  if (!post) notFound()
  
  return (<><Header />
    <section className="bg-primary py-12 text-center text-primary-foreground"><h1 className="text-4xl font-bold">{post.title}</h1><div className="mt-3 flex items-center justify-center gap-4 text-sm text-primary-foreground/70"><span>{post.category}</span><span>{post.date}</span><span>{post.author}</span></div></section>
    <section className="bg-background py-16"><div className="mx-auto max-w-3xl px-4">
      {post.image && <img src={post.image} alt={post.title} className="mb-8 w-full rounded-xl" />}
      <div className="prose prose-gray mx-auto max-w-none"><p className="text-lg text-muted-foreground">{post.excerpt}</p></div>
      <div className="mt-8 border-t border-border pt-6 text-center"><Link href="/blog" className="text-primary hover:underline">← Volver al blog</Link></div>
    </div></section>
    <Footer />
  </>)
}
