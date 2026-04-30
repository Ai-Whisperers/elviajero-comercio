import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"

const nav = [
  {label:"Inicio",href:"/"},{label:"Servicios",href:"/servicios"},{label:"Catálogo",href:"/catalogo"},
  {label:"Sobre",href:"/sobre"},{label:"Preguntas",href:"/faq"},{label:"Contacto",href:"/contacto"}
]

export default function SobrePage() {
  return (
    <>
      <Header logo="/images/covers/logo-blanco.svg" navItems={nav} />
      <section className="flex min-h-[30vh] items-center justify-center bg-background px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground">Sobre Dayah</h1>
          <p className="mt-3 text-lg text-muted-foreground">Dise adora de portadas con pasi n por la lectura</p>
        </div>
      </section>
      <section className="bg-surface py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="mb-4 text-2xl font-bold text-foreground">Daihana Araujo</h2>
              <p className="mb-4 text-muted-foreground leading-relaxed">
                Dise adora gr fica especializada en portadas de libros desde 2019. Con m s de 80 proyectos entregados a autores indie en todo el mundo, mi objetivo es darle a cada historia la portada que merece.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Trabajo con autores de habla hispana e internacionales, en g neros que van desde la fantas a pica hasta el romance contempor neo. Cada proyecto comienza con un brief detallado y termina con archivos listos para publicaci n en Amazon KDP, IngramSpark, o cualquier plataforma.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="h-80 w-80 rounded-2xl bg-gradient-to-br from-primary to-secondary" />
            </div>
          </div>
        </div>
      </section>
      <Footer logo="/images/covers/logo-blanco.svg" businessName="Dayah LitWorks" email="dayahlitworks@gmail.com" whatsapp="595986868241" instagram="@dayah.litworks" facebook="https://www.facebook.com/bookc0verdesign/" />
      <WhatsAppFloat phone="595986868241" />
    </>
  )
}
