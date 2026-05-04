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
  removeAddress: (id: string) => Promise<void>
  orders: Order[]
  refreshOrders: () => Promise<void>
  addOrder: (o: Omit<Order, "id" | "date" | "status">) => Promise<string>
  favorites: string[]
  toggleFavorite: (productName: string) => void
  isFavorite: (productName: string) => boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

async function api(path: string, options?: RequestInit) {
  const token = typeof window !== "undefined" ? localStorage.getItem("viajero_token") : null
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  })
  return res.json()
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [favorites, setFavorites] = useState<string[]>([])

  // Restore session on mount
  useEffect(() => {
    if (typeof window === "undefined") return
    const token = localStorage.getItem("viajero_token")
    if (!token) return

    api("/api/auth", {
      method: "POST",
      body: JSON.stringify({ action: "me", token }),
    }).then((res) => {
      if (res.ok) {
        setUser(res.user)
        loadAddresses(token)
        loadOrders(token)
      } else {
        localStorage.removeItem("viajero_token")
      }
    })
  }, [])

  function loadAddresses(token: string) {
    api("/api/addresses").then((res) => {
      if (Array.isArray(res)) setAddresses(res)
    })
  }

  function loadOrders(token: string) {
    api("/api/orders").then((res) => {
      if (Array.isArray(res)) {
        setOrders(res.map((o: any) => ({
          ...o,
          date: o.createdAt || o.date,
        })))
      }
    })
  }

  const login = useCallback(async (email: string, password: string) => {
    const res = await api("/api/auth", {
      method: "POST",
      body: JSON.stringify({ action: "login", email, password }),
    })
    if (!res.ok) return { ok: false, error: res.error || "Error al iniciar sesión" }
    localStorage.setItem("viajero_token", res.token)
    setUser(res.user)
    loadAddresses(res.token)
    loadOrders(res.token)
    return { ok: true }
  }, [])

  const register = useCallback(async (name: string, email: string, password: string, phone: string) => {
    const res = await api("/api/auth", {
      method: "POST",
      body: JSON.stringify({ action: "register", name, email, password, phone }),
    })
    if (!res.ok) return { ok: false, error: res.error || "Error al registrarse" }
    return { ok: true }
  }, [])

  const logout = useCallback(async () => {
    const token = localStorage.getItem("viajero_token")
    if (token) {
      await api("/api/auth", {
        method: "POST",
        body: JSON.stringify({ action: "logout", token }),
      })
    }
    localStorage.removeItem("viajero_token")
    setUser(null)
    setAddresses([])
    setOrders([])
    setFavorites([])
  }, [])

  const updateProfile = useCallback(async (data: Partial<User>) => {
    if (!user) return { ok: false, error: "No hay sesión" }
    const token = localStorage.getItem("viajero_token")
    const res = await fetch("/api/update-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!json.ok) return { ok: false, error: json.error || "Error" }
    setUser({ ...user, ...data })
    return { ok: true }
  }, [user])

  const changePassword = useCallback(async (current: string, newPass: string) => {
    if (!user) return { ok: false, error: "No hay sesión" }
    if (newPass.length < 6) return { ok: false, error: "Mínimo 6 caracteres" }
    const token = localStorage.getItem("viajero_token")
    const res = await fetch("/api/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ current, newPass }),
    })
    const json = await res.json()
    return json.ok ? { ok: true } : { ok: false, error: json.error || "Error" }
  }, [user])

  const addAddress = useCallback(async (a: Omit<Address, "id">) => {
    const res: any = await api("/api/addresses", {
      method: "POST",
      body: JSON.stringify(a),
    })
    if (res.ok) {
      setAddresses(prev => [...prev, res.address])
    }
    return res.ok ? { ok: true } : { ok: false, error: res.error || "Error" }
  }, [])

  const updateAddress = useCallback(async (id: string, a: Partial<Address>) => {
    const res: any = await api("/api/addresses", {
      method: "PUT",
      body: JSON.stringify({ id, ...a }),
    })
    if (res.ok) {
      setAddresses(prev => prev.map(ad => ad.id === id ? res.address : ad))
    }
    return res.ok ? { ok: true } : { ok: false, error: res.error || "Error" }
  }, [])

  const removeAddress = useCallback(async (id: string) => {
    const res: any = await api("/api/addresses", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    })
    if (res.ok) {
      setAddresses(prev => prev.filter(a => a.id !== id))
    }
  }, [])

  const addOrder = useCallback(async (o: Omit<Order, "id" | "date" | "status">): Promise<string> => {
    const res: any = await api("/api/orders", {
      method: "POST",
      body: JSON.stringify(o),
    })
    if (res.ok) {
      setOrders(prev => [res.order, ...prev])
      return res.order.id
    }
    return ""
  }, [])

  const refreshOrders = useCallback(async () => {
    const res = await api("/api/orders")
    if (Array.isArray(res)) {
      setOrders(res.map((o: any) => ({
        ...o,
        date: o.createdAt || o.date,
      })))
    }
  }, [])

  const loadFavorites = useCallback(() => {
    if (!user) return
    const favs = JSON.parse(localStorage.getItem(`viajero_favs_${user.id}`) || "[]")
    setFavorites(favs)
  }, [user])

  useEffect(() => {
    if (user && typeof window !== "undefined") loadFavorites()
    else setFavorites([])
  }, [user, loadFavorites])

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
      orders, refreshOrders, addOrder,
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
