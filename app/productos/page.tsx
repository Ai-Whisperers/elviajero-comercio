import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import content from "@/content/es.json"
const footer = (content as any).footer || {}
const whatsappData = (content as any).whatsapp || {}
const phone = whatsappData.phone || "595981234567"


const categories = [
  { icon: "🏕️", name: "Camping", items: ["Carpas", "Bolsas de dormir", "Colchones inflables", "Mochilas", "Linternas", "Faroles"] },
  { icon: "🎣", name: "Pesca", items: ["Cañas de pescar", "Reels", "Señuelos", "Anzuelos", "Plomadas", "Accesorios"] },
  { icon: "🏍️", name: "Auto y Moto", items: ["Cargadores", "Compresores", "Herramientas", "Acc. eléctricos", "Fundas", "Soportes"] },
  { icon: "🥾", name: "Outdoor", items: ["Calzado", "Ropa técnica", "Mochilas", "Bastones", "Cantimploras", "Navajas"] },
]

export default function ProductosPage() {
  return (
    <>
      <Header />
      <section className="flex min-h-[30vh] items-center justify-center bg-surface px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground">Productos</h1>
          <p className="mt-3 text-lg text-muted-foreground">Explorá nuestra variedad de productos</p>
        </div>
      </section>
      <section className="bg-background py-16">
        <div className="mx-auto max-w-7xl px-4">
          {categories.map((cat, i) => (
            <div key={i} className="mb-12 last:mb-0">
              <h2 className="mb-6 text-2xl font-bold text-foreground">{cat.icon} {cat.name}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cat.items.map((item, j) => (
                  <div key={j} className="rounded-lg border border-border bg-surface p-4 transition-all hover:border-primary/30 hover:shadow-sm">
                    <p className="font-medium text-foreground">{item}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Consultar precio y disponibilidad</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer businessName="El Viajero" email={footer.email} whatsapp={phone} instagram={footer.instagram} facebook={footer.facebook} />
      <WhatsAppFloat phone={phone} message="Hola! Quiero info sobre productos" />
    </>
  )
}
