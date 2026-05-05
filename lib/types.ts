// Shared types for e-commerce
export interface CartItem {
  name: string
  price: string
  priceGs: number
  quantity: number
  imageUrl?: string
  category?: string
  priceBefore?: string
}
