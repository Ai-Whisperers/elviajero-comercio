export const STORAGE_KEYS = {
  CART: "viajero-cart",
  SAVED: "viajero_saved",
  FAVORITES: "viajero_favs_",
  FAVORITES_USER: (id: string) => "viajero_favs_" + id,
  TOKEN: "viajero_token",
  CURRENCY: "viajero_currency",
  LANGUAGE: "viajero_lang",
  LANG: "viajero_lang",
  THEME: "viajero_theme",
  PROMOS: "viajero_promos",
  USERS: "viajero_users",
  REVIEWS: "viajero_reviews",
  CATEGORIES: "viajero_admin_categories",
  PRODUCTS: "viajero_admin_products",
  SUBSCRIBERS: "viajero_subscribers",
  ADMIN_AUTH: "viajero_admin_auth",
  RESET_LINK: "viajero_reset_link",
}

export function getFavoritesKey(userId: string) {
  return STORAGE_KEYS.FAVORITES + userId
}
