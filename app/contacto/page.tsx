import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import content from "@/content/es.json"

const c = content as any
const info = c.contacto?.info || {}

export default function ContactoPage() {
  const waLink = "https://wa.me/" + (info.whatsapp || "595981234567")
  return (
    <>
      <Header />
      <section className="bg-primary py-12 text-center text-primary-foreground">
        <h1 className="text-4xl font-bold">{c.contacto?.hero?.headline || "Contacto"}</h1>
        <p className="mt-2 text-primary-foreground/80">{c.contacto?.hero?.subheadline}</p>
      </section>
      <section className="bg-background py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-surface p-8 shadow-sm">
              <h2 className="mb-6 text-2xl font-bold text-foreground">{c.contacto?.info?.title || "Informacion"}</h2>
              <div className="flex flex-col gap-4 text-sm">
                {info.address && <div><p className="font-semibold text-foreground">Direccion</p><p className="text-muted-foreground">{info.address}</p></div>}
                {info.phone && <div><p className="font-semibold text-foreground">Telefono</p><p className="text-muted-foreground">{info.phone}</p></div>}
                {info.whatsapp && <div><p className="font-semibold text-foreground">WhatsApp</p><a href={waLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Escribinos</a></div>}
                {info.email && <div><p className="font-semibold text-foreground">Email</p><p className="text-muted-foreground">{info.email}</p></div>}
                {info.hours && <div><p className="font-semibold text-foreground">Horarios</p><p className="text-muted-foreground">{info.hours}</p></div>}
              </div>
            </div>
            {c.contacto?.form && <div className="rounded-xl border border-border bg-surface p-8 shadow-sm">
              <h2 className="mb-6 text-2xl font-bold text-foreground">{c.contacto.form.title || "Envianos un mensaje"}</h2>
              <form action={waLink}><div className="flex flex-col gap-4">
                <input name="name" placeholder="Nombre" className="rounded-lg border border-border bg-white px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
                <input name="phone" type="tel" placeholder="Telefono" className="rounded-lg border border-border bg-white px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
                <input name="message" placeholder="Mensaje" className="rounded-lg border border-border bg-white px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
                <button className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90">{c.contacto.form.submitText || "Enviar"}</button>
              </div></form>
            </div>}
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
