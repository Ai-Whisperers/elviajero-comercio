/**
 * Test Factories — deterministic, reusable test data generators.
 *
 * Every factory returns a plain object. No random values —
 * everything is predictable so tests are reproducible and debuggable.
 *
 * Usage:
 *   import { productFactory, cartItemFactory } from "../test-helpers/factories"
 *   const product = productFactory({ name: "Custom Name" })
 */

// ─── Products ────────────────────────────────────────────────────────
export interface ProductSeed {
  id?: string
  name?: string
  slug?: string
  price?: string
  price_before?: string | null
  image_url?: string | null
  brand?: string
  category?: string
  stock?: number
  is_new?: boolean
  featured?: boolean
  description?: string
  specs?: string
  weight?: string
  variants?: any[] | null
}

export const DEFAULT_PRODUCT: Required<ProductSeed> = {
  id: "prod-001",
  name: "Bolsa de dormir camuflayado",
  slug: "bolsa-de-dormir-camuflayado",
  price: "Gs. 180.000",
  price_before: null,
  image_url: "https://example.com/bolsa.jpg",
  brand: "",
  category: "Camping",
  stock: 25,
  is_new: false,
  featured: false,
  description: "Bolsa de dormir para camping",
  specs: "Material: Poliéster|Peso: 1.2kg",
  weight: "1.2 kg",
  variants: null,
}

export function productFactory(overrides?: Partial<ProductSeed>): Required<ProductSeed> {
  return { ...DEFAULT_PRODUCT, ...overrides }
}

/** Generate N products with sequential IDs and unique names */
export function productFactoryN(n: number, overrides?: Partial<ProductSeed>): Required<ProductSeed>[] {
  return Array.from({ length: n }, (_, i) =>
    productFactory({
      id: `prod-${String(i + 1).padStart(3, "0")}`,
      name: `Producto Test ${i + 1}`,
      slug: `producto-test-${i + 1}`,
      ...overrides,
    })
  )
}

// ─── Cart Items ──────────────────────────────────────────────────────
export interface CartItemSeed {
  id?: string
  name?: string
  price?: string
  priceGs?: number
  quantity?: number
  variant?: string
  image?: string
  category?: string
  priceBefore?: string
}

export const DEFAULT_CART_ITEM: Required<CartItemSeed> = {
  id: "prod-001",
  name: "Bolsa de dormir camuflayado",
  price: "Gs. 180.000",
  priceGs: 180000,
  quantity: 1,
  variant: "",
  image: "",
  category: "Camping",
  priceBefore: "",
}

export function cartItemFactory(overrides?: Partial<CartItemSeed>): Required<CartItemSeed> {
  return { ...DEFAULT_CART_ITEM, ...overrides }
}

export function cartItemFactoryN(n: number, overrides?: Partial<CartItemSeed>): Required<CartItemSeed>[] {
  return Array.from({ length: n }, (_, i) =>
    cartItemFactory({
      id: `prod-${String(i + 1).padStart(3, "0")}`,
      name: `Item ${i + 1}`,
      priceGs: 100000 * (i + 1),
      price: `Gs. ${(100000 * (i + 1)).toLocaleString("es-PY")}`,
      ...overrides,
    })
  )
}

// ─── Customers ───────────────────────────────────────────────────────
export interface CheckoutCustomerSeed {
  name?: string
  phone?: string
  city?: string
  ruc?: string
}

export const DEFAULT_CUSTOMER: Required<CheckoutCustomerSeed> = {
  name: "Juan Pérez",
  phone: "595981234567",
  city: "Asunción",
  ruc: "",
}

export function customerFactory(overrides?: Partial<CheckoutCustomerSeed>): Required<CheckoutCustomerSeed> {
  return { ...DEFAULT_CUSTOMER, ...overrides }
}

// ─── Orders ──────────────────────────────────────────────────────────
export interface OrderSeed {
  id?: string
  user?: string
  items?: any[]
  total?: string
  status?: string
  paymentMethod?: string
  paymentStatus?: string
  date?: string
  customer_name?: string
  customer_phone?: string
  customer_email?: string
}

export const DEFAULT_ORDER: Required<OrderSeed> = {
  id: "ord-20260522-abc12345",
  user: "user-001",
  items: [],
  total: "Gs. 350.000",
  status: "pendiente",
  paymentMethod: "whatsapp",
  paymentStatus: "pending",
  date: "2026-05-22T12:00:00Z",
  customer_name: "Juan Pérez",
  customer_phone: "595981234567",
  customer_email: "juan@example.com",
}

export function orderFactory(overrides?: Partial<OrderSeed>): Required<OrderSeed> {
  return { ...DEFAULT_ORDER, ...overrides }
}

// ─── Reviews ─────────────────────────────────────────────────────────
export interface ReviewSeed {
  id?: string
  productName?: string
  userName?: string
  rating?: number
  text?: string
  date?: string
}

export const DEFAULT_REVIEW: Required<ReviewSeed> = {
  id: "rev001",
  productName: "Bolsa de dormir camuflayado",
  userName: "María",
  rating: 5,
  text: "Excelente producto",
  date: "2026-05-20T10:00:00Z",
}

export function reviewFactory(overrides?: Partial<ReviewSeed>): Required<ReviewSeed> {
  return { ...DEFAULT_REVIEW, ...overrides }
}

// ─── Promo Codes ─────────────────────────────────────────────────────
export interface PromoSeed {
  code?: string
  type?: "percent" | "fixed"
  value?: number
  minPurchase?: number
  active?: boolean
  expires?: string
}

export const DEFAULT_PROMO: Required<PromoSeed> = {
  code: "VIAJERO10",
  type: "percent",
  value: 10,
  minPurchase: 0,
  active: true,
  expires: "2027-12-31",
}

export function promoFactory(overrides?: Partial<PromoSeed>): Required<PromoSeed> {
  return { ...DEFAULT_PROMO, ...overrides }
}

// ─── Shipping ────────────────────────────────────────────────────────
export const SHIPPING_ZONES = [
  { id: "asu", name: "Asunción", fee: 15000, freeFrom: 300000, estimatedDays: "24 hs" },
  { id: "central", name: "Área Metropolitana", fee: 25000, freeFrom: 400000, estimatedDays: "24-48 hs" },
  { id: "interior", name: "Interior del país", fee: 40000, freeFrom: 500000, estimatedDays: "48-72 hs" },
  { id: "pickup", name: "Retiro en tienda", fee: 0, freeFrom: 0, estimatedDays: "—" },
] as const
