export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: string
  createdAt: string
}

export interface Address {
  id: string
  label: string
  name: string
  street: string
  city: string
  state: string
  zip: string
  phone: string
  isDefault: boolean
}

export interface OrderItem {
  name: string
  price: string
  quantity: number
  imageUrl?: string
}

export interface Order {
  id: string
  date: string
  items: OrderItem[]
  total: string
  status: "pendiente" | "confirmado" | "enviado" | "entregado" | "cancelado"
  addressId: string
  paymentMethod: string
}
