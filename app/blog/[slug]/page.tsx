import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"

const POSTS: Record<string, { title: string; date?: string }> = {
  "antes-y-despues-de-redesignar-portadas-de-libros": { title: "Antes y después de rediseñar portadas de libros", date: "2026-03" },
  "consejos-de-diseno-de-portadas-de-libros": { title: "Consejos de diseño de portadas de libros", date: "2026-03" },
  "guia-de-tipografia-para-autores": { title: "Guía de tipografía para autores", date: "2026-04" },
  "marketing-para-autores-independientes": { title: "Marketing para autores independientes", date: "2026-04" },
  "teoria-del-color-para-portadas-de-libros": { title: "Teoría del color para portadas de libros", date: "2026-04" },
}

function Nav() {
  return (
    <Header logo="/images/covers/logo-blanco.svg" navItems={[
      {label:"Inicio",href:"/"},{label:"Servicios",href:"/servicios"},{label:"Catálogo",href:"/catalogo"},
      {label:"Sobre",href:"/sobre"},{label:"Preguntas",href:"/faq"},{label:"Contacto",href:"/contacto"}
    ]} />
  )
}

function SiteFooter() {
  return (
    <Footer logo="/images/covers/logo-blanco.svg" businessName="Dayah LitWorks" email="dayahlitworks@gmail.com" whatsapp="595986868241" instagram="@dayah.litworks" facebook="https://www.facebook.com/bookc0verdesign/" />
  )
}

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const post = POSTS[slug]

  if (!post) {
    return (
      <>
        <Nav />
        <section className="bg-surface py-16">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h1 className="text-2xl font-bold text-foreground">Artículo no encontrado</h1>
            <Link href="/blog" className="mt-4 inline-block text-primary hover:underline">Volver al blog</Link>
          </div>
        </section>
        <SiteFooter />
        <WhatsAppFloat phone="595986868241" />
      </>
    )
  }

  return (
    <>
      <Nav />
      <section className="bg-surface py-16">
        <div className="mx-auto max-w-3xl px-4">
          <Link href="/blog" className="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground">&larr; Volver al blog</Link>
          <h1 className="mb-2 text-3xl font-bold text-foreground">{post.title}</h1>
          {post.date && <p className="mb-8 text-sm text-muted-foreground">{post.date}</p>}
          <div className="text-muted-foreground leading-relaxed">
            <p>Artículo completo próximamente.</p>
          </div>
        </div>
      </section>
      <SiteFooter />
      <WhatsAppFloat phone="595986868241" />
    </>
  )
}
