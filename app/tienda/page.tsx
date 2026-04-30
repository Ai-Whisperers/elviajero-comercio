import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import content from "@/content/es.json"

const footer = (content as any).footer || {}
const whatsappData = (content as any).whatsapp || {}
const phone = whatsappData.phone || "595981234567"

export default function TiendaPage() {
  return (
    <>
      <Header />
      <section className="flex min-h-[30vh] items-center justify-center bg-surface px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground">Tienda Online</h1>
          <p className="mt-3 text-lg text-muted-foreground">Compra desde casa y recibí en tu puerta</p>
        </div>
      </section>
      <section className="bg-background py-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: "🏕️", title: "Camping", desc: "Carpas, bolsas de dormir, colchones inflables y más" },
              { icon: "🎣", title: "Pesca", desc: "Cañas, reels, señuelos y accesorios de pesca" },
              { icon: "🏍️", title: "Auto y Moto", desc: "Accesorios, herramientas y equipo para vehículos" },
              { icon: "🥾", title: "Outdoor", desc: "Mochilas, botas, ropa técnica y equipo de aventura" },
              { icon: "🔦", title: "Iluminación", desc: "Linternas, faroles, baterías portátiles" },
              { icon: "🧰", title: "Herramientas", desc: "Multifuncionales, kits de reparación y más" },
            ].map((cat, i) => (
              <a key={i} href={`https://wa.me/${phone}`} target="_blank" rel="noopener noreferrer"
                className="group rounded-xl border border-border bg-surface p-8 text-center transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="mb-4 text-4xl">{cat.icon}</div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{cat.title}</h3>
                <p className="text-sm text-muted-foreground">{cat.desc}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-primary group-hover:underline">Consultar por WhatsApp →</span>
              </a>
            ))}
          </div>
        </div>
      </section>
      <Footer businessName="El Viajero" email={footer.email} whatsapp={phone} instagram={footer.instagram} facebook={footer.facebook} />
      <WhatsAppFloat phone={phone} message="Hola! Quiero info sobre productos" />
    </>
  )
}
