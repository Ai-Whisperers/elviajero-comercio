// Routes configuration — shared between middleware and components
export const PUBLIC_ROUTES = [
  '/', '/tienda', '/productos', '/producto/', '/nosotros', '/contacto',
  '/faq', '/blog', '/promociones', '/privacidad', '/terminos',
  '/login', '/register', '/recuperar',
]

export const PUBLIC_PREFIXES = [
  '/producto/', '/blog/', '/_next/', '/images/', '/favicon',
]

export const PROTECTED_ROUTES = [
  '/mi-cuenta', '/admin', '/checkout',
]

export const STATIC_FILES = [
  '/sitemap.xml', '/rss.xml', '/robots.txt',
]

export const ADMIN_ROLE = 'admin'
