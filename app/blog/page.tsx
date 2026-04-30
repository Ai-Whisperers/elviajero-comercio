import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"

const posts = [
  { title: "Antes y después de rediseñar portadas de libros", slug: "antes-y-despues-de-redesignar-portadas-de-libros", date: "2026-03" },
  { title: "Consejos de diseño de portadas de libros", slug: "consejos-de-diseno-de-portadas-de-libros", date: "2026-03" },
  { title: "Guía de tipografía para autores", slug: "guia-de-tipografia-para-autores", date: "2026-04" },
  { title: "Marketing para autores independientes", slug: "marketing-para-autores-independientes", date: "2026-04" },
  { title: "Teoría del color para portadas de libros", slug: "teoria-del-color-para-portadas-de-libros", date: "2026-04" },
]

export default function BlogPage() {
  return (
    <>
      <Header logo="/images/covers/logo-blanco.svg" navItems={[
        {label:"Inicio",href:"/"},{label:"Servicios",href:"/servicios"},{label:"Catálogo",href:"/catalogo"},
        {label:"Sobre",href:"/sobre"},{label:"Preguntas",href:"/faq"},{label:"Contacto",href:"/contacto"}
      ]} />
      <section className="flex min-h-[30vh] items-center justify-center bg-background px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground">Blog</h1>
          <p className="mt-3 text-lg text-muted-foreground">Tips de diseño, tendencias y consejos para autores</p>
        </div>
      </section>
      <section className="bg-surface py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}
                className="group block rounded-lg border border-border bg-background p-6 transition-all hover:-translate-y-1 hover:shadow-md">
                {post.date && <p className="mb-2 text-xs text-muted-foreground">{post.date}</p>}
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary">{post.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer logo="/images/covers/logo-blanco.svg" businessName="Dayah LitWorks" email="dayahlitworks@gmail.com" whatsapp="595986868241" instagram="@dayah.litworks" facebook="https://www.facebook.com/bookc0verdesign/" />
      <WhatsAppFloat phone="595986868241" />
    </>
  )
}
