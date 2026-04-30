import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"

const nav = [
  {label:"Inicio",href:"/"},{label:"Servicios",href:"/servicios"},{label:"Catálogo",href:"/catalogo"},
  {label:"Sobre",href:"/sobre"},{label:"Preguntas",href:"/faq"},{label:"Contacto",href:"/contacto"}
]

export default function PrivacidadPage() {
  return (
    <>
      <Header logo="/images/covers/logo-blanco.svg" navItems={nav} />
      <section className="flex min-h-[30vh] items-center justify-center bg-background px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground">Pol tica de Privacidad</h1>
        </div>
      </section>
      <section className="bg-surface py-16">
        <div className="mx-auto max-w-3xl px-4 text-muted-foreground leading-relaxed">
          <p className="mb-4">En Dayah LitWorks nos tomamos tu privacidad en serio. Esta pol tica explica c mo recopilamos, usamos y protegemos tu informaci n.</p>
          <h2 className="mb-3 mt-8 text-xl font-semibold text-foreground">Informaci n que recopilamos</h2>
          <p className="mb-4">Recopilamos la informaci n que nos proporcionas voluntariamente a trav s de nuestros formularios de contacto, WhatsApp, o correo electr nico: nombre, direcci n de correo, n mero de tel fono, y detalles sobre tu proyecto de portada.</p>
          <h2 className="mb-3 mt-8 text-xl font-semibold text-foreground">Uso de la informaci n</h2>
          <p className="mb-4">Usamos tu informaci n exclusivamente para: comunicarnos con vos sobre tu proyecto, enviarte cotizaciones, y prestarte nuestros servicios de dise o de portadas.</p>
          <h2 className="mb-3 mt-8 text-xl font-semibold text-foreground">Contacto</h2>
          <p>Si ten s preguntas sobre esta pol tica, escribinos a dayahlitworks@gmail.com</p>
        </div>
      </section>
      <Footer logo="/images/covers/logo-blanco.svg" businessName="Dayah LitWorks" email="dayahlitworks@gmail.com" whatsapp="595986868241" instagram="@dayah.litworks" facebook="https://www.facebook.com/bookc0verdesign/" />
      <WhatsAppFloat phone="595986868241" />
    </>
  )
}
