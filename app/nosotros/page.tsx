import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import content from "@/content/es.json"
const c = content as any
const story = c.about?.story?.paragraphs || []
const vals = c.about?.values || []
export default function NosotrosPage() {
  return (<><Header />
    <section className="bg-primary py-12 text-center text-primary-foreground"><h1 className="text-4xl font-bold">{c.about?.hero?.headline || "Nosotros"}</h1><p className="mt-2 text-primary-foreground/80">{c.about?.hero?.subheadline}</p></section>
    <section className="bg-background py-16"><div className="mx-auto max-w-3xl px-4">{story.map((p:string,i:number)=><p key={i} className="mb-4 text-muted-foreground leading-relaxed">{p}</p>)}</div></section>
    {vals.length > 0 && <section className="bg-surface-light py-16"><div className="mx-auto max-w-7xl px-4"><h2 className="mb-8 text-center text-3xl font-bold text-foreground">Nuestros Valores</h2><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{vals.map((v:any,i:number)=>(<div key={i} className="rounded-xl border border-border bg-white p-6 text-center shadow-sm"><h3 className="mb-2 text-lg font-bold text-foreground">{v.title}</h3><p className="text-sm text-muted-foreground">{v.description}</p></div>))}</div></div></section>}
    <Footer />
  </>)
}