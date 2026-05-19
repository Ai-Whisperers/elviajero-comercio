// Shared types for e-commerce
export interface CartItem {
  id?: string
  productId?: string
  name: string
  price: string
  priceGs: number
  quantity: number
  imageUrl?: string
  image?: string
  category?: string
  priceBefore?: string
  variant?: string
}
