"use client"
export const dynamic = "force-dynamic"
import { useAuth, AuthProvider } from "@ai-whisperers/auth/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CookieConsent } from "@/components/cookie-consent"
import Link from "next/link"
import Image from "next/image"
import content from "@/content/es.json"

const c = content as any
const allProducts = c.home?.productCatalog?.products || []

function FavoritesForm() {
  const { favorites, toggleFavorite } = useAuth()
  const favProducts = allProducts.filter((p: any) => favorites.includes(p.name))

  return (
    <>
      <Header />
      <section className="min-h-[70vh] bg-muted/30 pb-20 pt-8">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-6 flex items-center gap-3">
            <Link href="/mi-cuenta" className="text-muted-foreground hover:text-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Mis Favoritos</h1>
          </div>

          {favProducts.length === 0 ? (
            <div className="rounded-xl border border-border bg-surface p-12 text-center">
              <div className="text-5xl mb-4">🤍</div>
              <p className="font-medium text-foreground">No tenés favoritos todavía</p>
              <p className="mt-1 text-sm text-muted-foreground">Guardá productos haciendo clic en el corazón</p>
              <Link href="/tienda" className="mt-4 inline-block rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                Explorar productos
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {favProducts.map((p: any, i: number) => (
                <div key={i} className="group relative overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                  <button onClick={() => toggleFavorite(p.name)}
                    className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-sm transition-all hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-destructive">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <Link href="/tienda" className="block">
                    <div className="aspect-square bg-muted p-4 flex items-center justify-center">
                      {p.imageUrl && <Image src={p.imageUrl} alt={p.name} width={200} height={200} className="h-full w-full object-contain" />}
                    </div>
                    <div className="p-4">
                      {p.brand && <p className="text-xs font-medium text-muted-foreground">{p.brand}</p>}
                      <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary">{p.name}</h3>
                      <p className="mt-1 text-lg font-bold text-primary">{p.price}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
      <CookieConsent />
    </>
  )
}

export default function FavoritesPage() {
  return (
    <AuthProvider>
      <FavoritesForm />
    </AuthProvider>
  )
}
