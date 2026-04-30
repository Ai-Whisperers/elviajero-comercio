import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import content from "@/content/es.json"
import Link from "next/link"
import Image from "next/image"

const c = content as any
const cat = c.home?.productCatalog || {}
const cats = cat.categories || []
const products = cat.products || []

export default function Tienda() {
  return (<><Header />
    <section className="bg-primary py-12 text-center text-primary-foreground"><h1 className="text-4xl font-bold">Tienda Online</h1><p className="mt-2 text-primary-foreground/80">{c.tienda?.hero?.subheadline}</p></section>

    {c.tienda?.trustBadges?.items?.length > 0 && <section className="bg-surface-light py-8"><div className="mx-auto max-w-7xl px-4"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{(c.tienda.trustBadges.items||[]).map((b:any,i:number)=>(
      <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-white p-4"><div><p className="font-semibold text-foreground">{b.text}</p><p className="text-xs text-muted-foreground">{b.description}</p></div></div>
    ))}</div></div></section>}

    <section className="bg-background py-16"><div className="mx-auto max-w-7xl px-4">
      <h2 className="mb-6 text-2xl font-bold text-foreground">{cat.title}</h2>
      {cats.map((category:string)=>(
        <div key={category} id={category.toLowerCase().replace(/[^a-z]/g,"")} className="mb-12">
          <h3 className="mb-4 text-xl font-bold text-primary">{category}</h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.filter((p:any)=>p.category===category).map((p:any,i:number)=>(
              <div key={i} className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="aspect-[3/2] bg-muted flex items-center justify-center overflow-hidden">
                  {p.imageUrl && <Image src={p.imageUrl} alt={p.name} width={400} height={267} className="h-full w-full object-cover" />}
                  {!p.imageUrl && <div className="text-muted-foreground text-sm">Sin imagen</div>}
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-foreground">{p.name}</h4>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{p.description}</p>
                  <p className="mt-2 text-lg font-bold text-primary">{p.price}</p>
                  <a href={`https://wa.me/${cat.whatsappPhone || "595981234567"}?text=${encodeURIComponent((cat.orderMessageTemplate||"").replace("{{productName}}",p.name).replace("{{productPrice}}",p.price))}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90">{cat.orderButtonText || "Consultar"}</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div></section>

    <Footer />
  </>)
}
