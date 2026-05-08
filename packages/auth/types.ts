export type User = {
  id: string
  email: string
  name: string
  phone: string
  role: string
  createdAt: string
}

export type Address = {
  id: string
  userId: string
  street: string
  city: string
  state?: string
  zip?: string
  isDefault?: boolean
}

export type Order = {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  status: string
  createdAt: string
}

export type OrderItem = {
  id: string
  productId: string
  name: string
  quantity: number
  price: number
}
