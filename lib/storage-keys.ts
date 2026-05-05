// Single source of truth for all localStorage keys
export const STORAGE_KEYS = {
  CURRENCY: "viajero_currency",
  LANG: "viajero_lang",
  FAVORITES: "viajero_favs",
  FAVORITES_USER: (userId: string) => `viajero_favs_${userId}`,
  CART_ACTIVITY: "viajero_cart_activity",
  CART_REMINDER_SENT: "viajero_cart_reminder_sent",
  PROMOS: "viajero_promos",
} as const

export const COOKIE_KEYS = {
  CURRENCY: "viajero_currency",
} as const
