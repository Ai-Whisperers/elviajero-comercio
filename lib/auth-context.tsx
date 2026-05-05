"use client"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

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

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  register: (name: string, email: string, password: string, phone: string) => Promise<{ ok: boolean; error?: string }>
  loginWithGoogle: () => Promise<void>
  loginWithFacebook: () => Promise<void>
  logout: () => Promise<void>
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [supabase] = useState(() => createClient())
  const [addresses, setAddresses] = useState<Address[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [favorites, setFavorites] = useState<string[]>([])

  const refreshOrders = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
    if (data) setOrders(data.map((o: any) => ({ ...o, id: o.id || "", date: o.created_at || o.date, items: o.items || [], total: o.total || "0", status: o.status || "pendiente", addressId: o.address_id || "", paymentMethod: o.payment_method || "" })))
  }, [user, supabase])

  const loadAddresses = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
    if (data) setAddresses(data.map((a: any) => ({ id: a.id, label: a.label || "", name: a.name || "", street: a.street, city: a.city, state: a.state || "", zip: a.zip || "", phone: a.phone || "", isDefault: a.is_default })))
  }, [user, supabase])

  const fetchProfile = useCallback(async (supabaseUser: SupabaseUser) => {
    try {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", supabaseUser.id)
        .single()
      if (data) {
        setUser({ id: data.id, name: data.name || supabaseUser.email?.split("@")[0] || "", email: supabaseUser.email || "", phone: data.phone || "", role: data.role || "customer", createdAt: data.created_at || "" })
      } else {
        setUser({ id: supabaseUser.id, name: supabaseUser.email?.split("@")[0] || "", email: supabaseUser.email || "", phone: "", role: "customer", createdAt: supabaseUser.created_at || "" })
      }
    } catch {
      setUser({ id: supabaseUser.id, name: supabaseUser.email?.split("@")[0] || "", email: supabaseUser.email || "", phone: "", role: "customer", createdAt: supabaseUser.created_at || "" })
    }
  }, [supabase])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) fetchProfile(session.user)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) { fetchProfile(session.user); loadAddresses(); refreshOrders() }
      else { setUser(null); setAddresses([]); setOrders([]) }
    })

    return () => subscription.unsubscribe()
  }, [supabase, fetchProfile, loadAddresses, refreshOrders])

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { ok: false, error: error.message === "Invalid login credentials" ? "Credenciales incorrectas" : error.message }
    return { ok: true }
  }, [supabase])

  const register = useCallback(async (name: string, email: string, password: string, phone: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, phone } },
    })
    if (error) {
      if (error.message.includes("already registered")) return { ok: false, error: "Email ya registrado" }
      return { ok: false, error: error.message }
    }
    return { ok: true }
  }, [supabase])

  const loginWithGoogle = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }, [supabase])

  const loginWithFacebook = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }, [supabase])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    setAddresses([])
    setOrders([])
    setFavorites([])
  }, [supabase])

  const updateProfile = useCallback(async (data: Partial<User>) => {
    if (!user) return { ok: false, error: "No hay sesión" }
    const updates: any = {}
    if (data.name) updates.name = data.name
    if (data.phone !== undefined) updates.phone = data.phone
    const { error } = await supabase.from("profiles").update(updates).eq("id", user.id)
    if (error) return { ok: false, error: error.message }
    setUser({ ...user, ...data })
    return { ok: true }
  }, [user, supabase])

  const changePassword = useCallback(async (_current: string, newPass: string) => {
    if (newPass.length < 6) return { ok: false, error: "Mínimo 6 caracteres" }
    const { error } = await supabase.auth.updateUser({ password: newPass })
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  }, [supabase])

  const addAddress = useCallback(async (a: Omit<Address, "id">) => {
    if (!user) return { ok: false, error: "No hay sesión" }
    if (a.isDefault) await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id)
    const { data, error } = await supabase.from("addresses").insert({
      user_id: user.id, label: a.label, name: a.name, street: a.street,
      city: a.city, state: a.state, zip: a.zip, phone: a.phone, is_default: a.isDefault,
    }).select().single()
    if (error) return { ok: false, error: error.message }
    if (data) {
      setAddresses(prev => [...prev, { id: data.id, label: data.label || "", name: data.name || "", street: data.street, city: data.city, state: data.state || "", zip: data.zip || "", phone: data.phone || "", isDefault: data.is_default }])
    }
    return { ok: true }
  }, [user, supabase])

  const updateAddress = useCallback(async (id: string, a: Partial<Address>) => {
    if (!user) return { ok: false, error: "No hay sesión" }
    const updates: any = {}
    if (a.label !== undefined) updates.label = a.label
    if (a.name !== undefined) updates.name = a.name
    if (a.street !== undefined) updates.street = a.street
    if (a.city !== undefined) updates.city = a.city
    if (a.state !== undefined) updates.state = a.state
    if (a.zip !== undefined) updates.zip = a.zip
    if (a.phone !== undefined) updates.phone = a.phone
    if (a.isDefault !== undefined) { updates.is_default = a.isDefault; await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id) }
    const { error } = await supabase.from("addresses").update(updates).eq("id", id).eq("user_id", user.id)
    if (error) return { ok: false, error: error.message }
    setAddresses(prev => prev.map(ad => ad.id === id ? { ...ad, ...a } : ad))
    return { ok: true }
  }, [user, supabase])

  const removeAddress = useCallback(async (id: string) => {
    if (!user) return
    await supabase.from("addresses").delete().eq("id", id).eq("user_id", user.id)
    setAddresses(prev => prev.filter(a => a.id !== id))
  }, [user, supabase])

  const addOrder = useCallback(async (o: Omit<Order, "id" | "date" | "status">): Promise<string> => {
    if (!user) return ""
    const id = "ORD-" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase()
    const { error } = await supabase.from("orders").insert({
      id, user_id: user.id, items: o.items, total: o.total || "0",
      status: "pendiente", address_id: o.addressId || "", payment_method: o.paymentMethod || "",
    })
    if (error) return ""
    setOrders(prev => [{ id, date: new Date().toISOString(), items: o.items, total: o.total, status: "pendiente", addressId: o.addressId || "", paymentMethod: o.paymentMethod || "" } as Order, ...prev])
    return id
  }, [user, supabase])

  useEffect(() => { if (user) { loadAddresses(); refreshOrders() } }, [user, loadAddresses, refreshOrders])

  useEffect(() => {
    if (user) {
      const favs = JSON.parse(localStorage.getItem(`viajero_favs_${user.id}`) || "[]")
      setFavorites(favs)
    } else setFavorites([])
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
      user, loading, login, register, loginWithGoogle, loginWithFacebook, logout, updateProfile, changePassword,
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
