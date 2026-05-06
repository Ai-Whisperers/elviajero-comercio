export interface CartItem {
  category?: string
  id: string
  productId: string
  name: string
  price: number
  priceGs?: number
  priceBefore?: number
  quantity: number
  image?: string
  variant?: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  compareAtPrice?: number
  images: string[]
  category: string
  inStock: boolean
  variants?: ProductVariant[]
}

export interface ProductVariant {
  id: string
  name: string
  price?: number
}

export interface Order {
  id: string
  items: any[]
  total: number | string
  status: string
  created_at?: string
  createdAt?: string
  customer_name?: string
  customerName?: string
  customer_phone?: string
  customerPhone?: string
  customer_email?: string
  customerEmail?: string
  shipping_address?: string
  shippingAddress?: Address
  payment_method?: string
  note?: string
  [key: string]: any
}

export interface Address {
  street: string
  city: string
  state: string
  zip?: string
  country: string
  notes?: string
}

export interface CheckoutStep {
  id: string
  label: string
  completed: boolean
}

export type CurrencyCode = 'PYG' | 'USD'
