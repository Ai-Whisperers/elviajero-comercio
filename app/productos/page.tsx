import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import content from "@/content/es.json"
import Link from "next/link"
import Image from "next/image"

const c = content as any
const cats = c.home?.productCatalog?.categories || []

function categorySlug(cat: string) {
  return cat.toLowerCase().replace(/[^a-z]/g, "")
}

const CATEGORY_CARD_IMAGES: Record<string, string> = {
  camping: "/images/marketing/category-camping.webp",
  pesca: "/images/marketing/category-pesca.webp",
  playaypesca: "/images/marketing/category-playa-pesca.webp",
  accpersonales: "/images/marketing/category-accesorios.webp",
  automviles: "/images/marketing/category-automoviles.webp",
  motos: "/images/marketing/category-motos.webp",
  campo: "/images/marketing/category-campo.webp",
}

export default function ProductosPage() {
  return (<><Header />
    <section className="bg-primary py-12 text-center text-primary-foreground"><h1 className="text-4xl font-bold">{c.productos?.hero?.headline || "Nuestros Productos"}</h1><p className="mt-2 text-primary-foreground/80">{c.productos?.hero?.subheadline}</p></section>
    <section className="bg-background py-16"><div className="mx-auto max-w-7xl px-4"><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{cats.map((cat:string,i:number)=>{
      const slug = categorySlug(cat)
      const img = CATEGORY_CARD_IMAGES[slug]
      return (
      <Link key={i} href={`/tienda#${slug}`} className="group overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
        <div className="relative aspect-video bg-muted overflow-hidden">
          {img ? (
            <Image src={img} alt={cat} width={600} height={338} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10"><span className="text-4xl font-bold text-primary">{cat[0]}</span></div>
          )}
        </div>
        <div className="p-6"><h3 className="text-xl font-bold text-foreground group-hover:text-primary">{cat}</h3><p className="mt-1 text-sm text-muted-foreground">Ver productos →</p></div>
      </Link>
    )})}</div></div></section>
    <Footer />
  </>)
}