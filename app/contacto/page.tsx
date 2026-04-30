import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"

const nav = [
  {label:"Inicio",href:"/"},{label:"Servicios",href:"/servicios"},{label:"Catálogo",href:"/catalogo"},
  {label:"Sobre",href:"/sobre"},{label:"Preguntas",href:"/faq"},{label:"Contacto",href:"/contacto"}
]

export default function ContactoPage() {
  return (
    <>
      <Header logo="/images/covers/logo-blanco.svg" navItems={nav} />
      <section className="flex min-h-[30vh] items-center justify-center bg-background px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground">Contacto</h1>
          <p className="mt-3 text-lg text-muted-foreground">Hablemos de tu pr xima portada</p>
        </div>
      </section>
      <section className="bg-surface py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="grid gap-8 sm:grid-cols-3">
            <a href="mailto:dayahlitworks@gmail.com" className="flex flex-col items-center rounded-xl border border-border bg-background p-8 text-center transition-all hover:-translate-y-1">
              <div className="mb-3 text-3xl">📧</div>
              <h3 className="font-semibold text-foreground">Email</h3>
              <p className="mt-1 text-sm text-muted-foreground">dayahlitworks@gmail.com</p>
            </a>
            <a href="https://wa.me/595986868241" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center rounded-xl border border-border bg-background p-8 text-center transition-all hover:-translate-y-1">
              <div className="mb-3 text-3xl">💬</div>
              <h3 className="font-semibold text-foreground">WhatsApp</h3>
              <p className="mt-1 text-sm text-muted-foreground">Respuesta r pida</p>
            </a>
            <a href="https://instagram.com/dayah.litworks" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center rounded-xl border border-border bg-background p-8 text-center transition-all hover:-translate-y-1">
              <div className="mb-3 text-3xl">📸</div>
              <h3 className="font-semibold text-foreground">Instagram</h3>
              <p className="mt-1 text-sm text-muted-foreground">@dayah.litworks</p>
            </a>
          </div>
        </div>
      </section>
      <Footer logo="/images/covers/logo-blanco.svg" businessName="Dayah LitWorks" email="dayahlitworks@gmail.com" whatsapp="595986868241" instagram="@dayah.litworks" facebook="https://www.facebook.com/bookc0verdesign/" />
      <WhatsAppFloat phone="595986868241" />
    </>
  )
}
