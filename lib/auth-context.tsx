"use client"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

export interface User {
  id: string
  name: string
  email: string
  phone: string
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

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  register: (name: string, email: string, password: string, phone: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<{ ok: boolean; error?: string }>
  changePassword: (current: string, newPass: string) => Promise<{ ok: boolean; error?: string }>
  addresses: Address[]
  addAddress: (a: Omit<Address, "id">) => Promise<{ ok: boolean; error?: string }>
  updateAddress: (id: string, a: Partial<Address>) => Promise<{ ok: boolean; error?: string }>
  removeAddress: (id: string) => void
  orders: Order[]
  addOrder: (o: Omit<Order, "id" | "date" | "status">) => string
  favorites: string[]
  toggleFavorite: (productName: string) => void
  isFavorite: (productName: string) => boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function hash(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h) + s.charCodeAt(i)
    h = h & h
  }
  return "h" + Math.abs(h).toString(36)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    try {
      const sess = localStorage.getItem("viajero_session")
      if (!sess) return
      const u: User = JSON.parse(sess)
      setUser(u)
      setAddresses(JSON.parse(localStorage.getItem(`viajero_addr_${u.id}`) || "[]"))
      setOrders(JSON.parse(localStorage.getItem(`viajero_orders_${u.id}`) || "[]"))
      setFavorites(JSON.parse(localStorage.getItem(`viajero_favs_${u.id}`) || "[]"))
    } catch {}
  }, [])

  const persistUser = useCallback((u: User | null) => {
    if (u) localStorage.setItem("viajero_session", JSON.stringify(u))
    else localStorage.removeItem("viajero_session")
    setUser(u)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const all = JSON.parse(localStorage.getItem("viajero_users") || "[]")
    const found = all.find((u: any) => u.email === email && u.password === hash(password))
    if (!found) return { ok: false, error: "Email o contraseña incorrectos" }
    const u: User = { id: found.id, name: found.name, email: found.email, phone: found.phone, createdAt: found.createdAt }
    persistUser(u)
    setAddresses(JSON.parse(localStorage.getItem(`viajero_addr_${u.id}`) || "[]"))
    setOrders(JSON.parse(localStorage.getItem(`viajero_orders_${u.id}`) || "[]"))
    setFavorites(JSON.parse(localStorage.getItem(`viajero_favs_${u.id}`) || "[]"))
    return { ok: true }
  }, [persistUser])

  const register = useCallback(async (name: string, email: string, password: string, phone: string) => {
    const all = JSON.parse(localStorage.getItem("viajero_users") || "[]")
    if (all.some((u: any) => u.email === email)) return { ok: false, error: "Este email ya está registrado" }
    if (password.length < 6) return { ok: false, error: "La contraseña debe tener al menos 6 caracteres" }
    const nu = { id: genId(), name, email, password: hash(password), phone, createdAt: new Date().toISOString() }
    all.push(nu)
    localStorage.setItem("viajero_users", JSON.stringify(all))
    const u: User = { id: nu.id, name, email, phone, createdAt: nu.createdAt }
    persistUser(u)
    return { ok: true }
  }, [persistUser])

  const logout = useCallback(() => {
    persistUser(null)
    setAddresses([])
    setOrders([])
    setFavorites([])
  }, [persistUser])

  const updateProfile = useCallback(async (data: Partial<User>) => {
    if (!user) return { ok: false, error: "No hay sesión" }
    const all = JSON.parse(localStorage.getItem("viajero_users") || "[]")
    const idx = all.findIndex((u: any) => u.id === user.id)
    if (idx === -1) return { ok: false, error: "Usuario no encontrado" }
    all[idx] = { ...all[idx], ...data }
    localStorage.setItem("viajero_users", JSON.stringify(all))
    const updated = { ...user, ...data }
    persistUser(updated)
    return { ok: true }
  }, [user, persistUser])

  const changePassword = useCallback(async (current: string, newPass: string) => {
    if (!user) return { ok: false, error: "No hay sesión" }
    if (newPass.length < 6) return { ok: false, error: "Mínimo 6 caracteres" }
    const all = JSON.parse(localStorage.getItem("viajero_users") || "[]")
    const found = all.find((u: any) => u.id === user.id)
    if (!found || found.password !== hash(current)) return { ok: false, error: "Contraseña actual incorrecta" }
    found.password = hash(newPass)
    localStorage.setItem("viajero_users", JSON.stringify(all))
    return { ok: true }
  }, [user])

  const addAddress = useCallback(async (a: Omit<Address, "id">) => {
    if (!user) return { ok: false, error: "No hay sesión" }
    const addrs: Address[] = JSON.parse(localStorage.getItem(`viajero_addr_${user.id}`) || "[]")
    if (addrs.length >= 10) return { ok: false, error: "Máximo 10 direcciones" }
    const na = { ...a, id: genId() }
    if (na.isDefault) addrs.forEach(ad => ad.isDefault = false)
    addrs.push(na)
    localStorage.setItem(`viajero_addr_${user.id}`, JSON.stringify(addrs))
    setAddresses([...addrs])
    return { ok: true }
  }, [user])

  const updateAddress = useCallback(async (id: string, a: Partial<Address>) => {
    if (!user) return { ok: false, error: "No hay sesión" }
    const addrs: Address[] = JSON.parse(localStorage.getItem(`viajero_addr_${user.id}`) || "[]")
    const idx = addrs.findIndex(ad => ad.id === id)
    if (idx === -1) return { ok: false, error: "Dirección no encontrada" }
    addrs[idx] = { ...addrs[idx], ...a }
    if (a.isDefault) addrs.forEach((ad, i) => { if (i !== idx) ad.isDefault = false })
    localStorage.setItem(`viajero_addr_${user.id}`, JSON.stringify(addrs))
    setAddresses([...addrs])
    return { ok: true }
  }, [user])

  const removeAddress = useCallback((id: string) => {
    if (!user) return
    const addrs: Address[] = JSON.parse(localStorage.getItem(`viajero_addr_${user.id}`) || "[]")
    const filtered = addrs.filter(a => a.id !== id)
    localStorage.setItem(`viajero_addr_${user.id}`, JSON.stringify(filtered))
    setAddresses(filtered)
  }, [user])

  const addOrder = useCallback((o: Omit<Order, "id" | "date" | "status">) => {
    if (!user) return ""
    const no: Order = { ...o, id: genId(), date: new Date().toISOString(), status: "pendiente" }
    const ords: Order[] = JSON.parse(localStorage.getItem(`viajero_orders_${user.id}`) || "[]")
    ords.unshift(no)
    localStorage.setItem(`viajero_orders_${user.id}`, JSON.stringify(ords))
    setOrders([...ords])
    return no.id
  }, [user])

  const toggleFavorite = useCallback((productName: string) => {
    if (!user) return
    const favs: string[] = JSON.parse(localStorage.getItem(`viajero_favs_${user.id}`) || "[]")
    const idx = favs.indexOf(productName)
    if (idx >= 0) favs.splice(idx, 1)
    else favs.push(productName)
    localStorage.setItem(`viajero_favs_${user.id}`, JSON.stringify(favs))
    setFavorites([...favs])
  }, [user])

  const isFavorite = useCallback((productName: string) => favorites.includes(productName), [favorites])

  return (
    <AuthContext.Provider value={{
      user, login, register, logout, updateProfile, changePassword,
      addresses, addAddress, updateAddress, removeAddress,
      orders, addOrder,
      favorites, toggleFavorite, isFavorite,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
