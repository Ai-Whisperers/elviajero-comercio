
export function getPageMeta(pathname: string): { title: string; description: string } {
  const site = "El Viajero"
  const base = "Camping, pesca y outdoor en Paraguay"
  const pages: Record<string, { title: string; description: string }> = {
    "/": { title: site + " — Tu Aventura Empieza Acá", description: base + ". Carpas, cañas de pesca, accesorios para auto y moto. Todo para tu aventura." },
    "/tienda": { title: "Tienda Online | " + site, description: "Comprá productos de camping, pesca y outdoor en Paraguay. Envío a todo el país." },
    "/nosotros": { title: "Sobre Nosotros | " + site, description: "Conocé más sobre El Viajero, tu tienda outdoor en Paraguay desde 2018." },
    "/contacto": { title: "Contacto | " + site, description: "Contactanos por WhatsApp, email o visitá nuestra tienda en Mariano Roque Alonso." },
    "/faq": { title: "Preguntas Frecuentes | " + site, description: "Respuestas a tus preguntas sobre compras, envíos, cambios y más en El Viajero." },
    "/blog": { title: "Blog | " + site, description: "Consejos de camping, pesca y vida outdoor en Paraguay. Leé nuestros artículos." },
    "/promociones": { title: "Promociones | " + site, description: "Ofertas y descuentos en productos de camping, pesca y outdoor en Paraguay." },
    "/login": { title: "Iniciar Sesión | " + site, description: "Accedé a tu cuenta de El Viajero." },
    "/register": { title: "Crear Cuenta | " + site, description: "Creá tu cuenta en El Viajero y empezá a comprar." },
    "/comparar": { title: "Comparar Productos | " + site, description: "Compará productos de camping, pesca y outdoor lado a lado." },
    "/privacidad": { title: "Política de Privacidad | " + site, description: "Política de privacidad de El Viajero." },
    "/terminos": { title: "Términos y Condiciones | " + site, description: "Términos y condiciones de uso de El Viajero." },
  }
  return pages[pathname] || { title: site, description: base }
}
