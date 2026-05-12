"use client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { useContent } from "@/lib/content-provider"

export default function ContactoPage() {
  const { get } = useContent()
  const info = get("contacto.info") || {}
  const waLink = "https://wa.me/" + (info.whatsapp || process.env.NEXT_PUBLIC_WHATSAPP || "595981234567")
  const contacto = get("contacto") || {}

  return (
    <>
      <Header />
      <section className="relative overflow-hidden py-16 text-center text-primary-foreground">
        <div className="pointer-events-none absolute inset-0">
          <Image src="/images/marketing/contact-hero-storefront.webp" alt="" fill className="object-cover object-[center_35%]" sizes="100vw" priority />
          <div className="absolute inset-0 bg-primary/78" aria-hidden />
        </div>
        <div className="relative z-10 px-4">
          <h1 className="text-4xl font-bold">{contacto.hero?.headline || "Contacto"}</h1>
          <p className="mt-2 text-primary-foreground/80">{contacto.hero?.subheadline}</p>
        </div>
      </section>
      <section className="bg-background py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-surface p-8 shadow-sm">
              <h2 className="mb-6 text-2xl font-bold text-foreground">{contacto.info?.title || "Informacion"}</h2>
              <div className="flex flex-col gap-4 text-sm">
                {info.address && <div><p className="font-semibold text-foreground">Direccion</p><p className="text-muted-foreground">{info.address}</p></div>}
                {info.phone && <div><p className="font-semibold text-foreground">Telefono</p><p className="text-muted-foreground">{info.phone}</p></div>}
                {info.whatsapp && <div><p className="font-semibold text-foreground">WhatsApp</p><a href={waLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Escribinos</a></div>}
                {info.email && <div><p className="font-semibold text-foreground">Email</p><p className="text-muted-foreground">{info.email}</p></div>}
                {info.hours && <div><p className="font-semibold text-foreground">Horarios</p><p className="text-muted-foreground">{info.hours}</p></div>}
              </div>
            </div>
            {contacto.form && <div className="rounded-xl border border-border bg-surface p-8 shadow-sm">
              <h2 className="mb-6 text-2xl font-bold text-foreground">{contacto.form.title || "Envianos un mensaje"}</h2>
              <form action={waLink}><div className="flex flex-col gap-4">
                <input name="name" placeholder="Nombre" className="rounded-lg border border-border bg-white px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
                <input name="phone" type="tel" placeholder="Telefono" className="rounded-lg border border-border bg-white px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
                <input name="message" placeholder="Mensaje" className="rounded-lg border border-border bg-white px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
                <button className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90">{contacto.form.submitText || "Enviar"}</button>
              </div></form>
            </div>}
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
