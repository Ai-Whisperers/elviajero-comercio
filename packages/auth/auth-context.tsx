"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import { createBrowserClient } from "@supabase/ssr"
import type { User } from "./types"

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface AuthCtx {
  user: User | null
  orders: any[]
  addresses: any[]
  favorites: string[]
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  loginWithGoogle: () => Promise<void>
  loginWithFacebook: () => Promise<void>
  register: (name: string, email: string, password: string, phone: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<{ ok: boolean; error?: string }>
  changePassword: (current: string, newPass: string) => Promise<{ ok: boolean; error?: string }>
  addAddress: (addr: any) => Promise<{ ok: boolean; error?: string }>
  updateAddress: (id: string, addr: any) => Promise<{ ok: boolean; error?: string }>
  removeAddress: (id: string) => Promise<{ ok: boolean; error?: string }>
  toggleFavorite: (productName: string) => void
}

const AuthContext = createContext<AuthCtx>(null!)

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}

function saveToStorage(key: string, value: any) {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(value))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [addresses, setAddresses] = useState<any[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = loadFromStorage<User | null>("viajero_user", null)
    if (storedUser) setUser(storedUser)
    setAddresses(loadFromStorage<any[]>("viajero_addresses_" + storedUser?.id, []))
    setFavorites(loadFromStorage<string[]>("viajero_favorites", []))
    setOrders(loadFromStorage<any[]>("viajero_orders_" + storedUser?.id, []))
    setLoading(false)

    // Listen for auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const u: User = {
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "",
          phone: session.user.user_metadata?.phone || "",
          role: "customer",
          createdAt: session.user.created_at || "",
        }
        setUser(u)
        saveToStorage("viajero_user", u)
        setAddresses(loadFromStorage<any[]>("viajero_addresses_" + u.id, []))
        setOrders(loadFromStorage<any[]>("viajero_orders_" + u.id, []))
      } else {
        setUser(null)
        localStorage.removeItem("viajero_user")
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { ok: false, error: error.message }
    const u: User = {
      id: data.user.id,
      email: data.user.email || "",
      name: data.user.user_metadata?.name || email.split("@")[0],
      phone: data.user.user_metadata?.phone || "",
      role: "customer",
      createdAt: data.user.created_at || "",
    }
    setUser(u)
    saveToStorage("viajero_user", u)
    setAddresses(loadFromStorage<any[]>("viajero_addresses_" + u.id, []))
    setOrders(loadFromStorage<any[]>("viajero_orders_" + u.id, []))
    return { ok: true }
  }, [])

  const loginWithGoogle = useCallback(async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" })
  }, [])

  const loginWithFacebook = useCallback(async () => {
    await supabase.auth.signInWithOAuth({ provider: "facebook" })
  }, [])

  const register = useCallback(async (name: string, email: string, password: string, phone: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, phone } },
    })
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  }, [])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    setOrders([])
    setAddresses([])
    localStorage.removeItem("viajero_user")
  }, [])

  const updateProfile = useCallback(async (data: Partial<User>) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { name: data.name, phone: data.phone },
      })
      if (error) return { ok: false, error: error.message }
      if (user) {
        const updated = { ...user, ...data }
        setUser(updated)
        saveToStorage("viajero_user", updated)
      }
      return { ok: true }
    } catch (e: any) {
      return { ok: false, error: e.message }
    }
  }, [user])

  const changePassword = useCallback(async (_current: string, newPass: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPass })
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  }, [])

  const addAddress = useCallback(async (addr: any) => {
    const newAddr = { ...addr, id: crypto.randomUUID?.() || Math.random().toString(36).slice(2) }
    const updated = [...addresses, newAddr]
    setAddresses(updated)
    saveToStorage("viajero_addresses_" + user?.id, updated)
    return { ok: true }
  }, [addresses, user])

  const updateAddress = useCallback(async (id: string, addr: any) => {
    const updated = addresses.map((a) => (a.id === id ? { ...a, ...addr } : a))
    setAddresses(updated)
    saveToStorage("viajero_addresses_" + user?.id, updated)
    return { ok: true }
  }, [addresses, user])

  const removeAddress = useCallback(async (id: string) => {
    const updated = addresses.filter((a) => a.id !== id)
    setAddresses(updated)
    saveToStorage("viajero_addresses_" + user?.id, updated)
    return { ok: true }
  }, [addresses, user])

  const toggleFavorite = useCallback((productName: string) => {
    const updated = favorites.includes(productName)
      ? favorites.filter((f) => f !== productName)
      : [...favorites, productName]
    setFavorites(updated)
    saveToStorage("viajero_favorites", updated)
  }, [favorites])

  if (loading) {
    return <>{children}</>
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        orders,
        addresses,
        favorites,
        login,
        loginWithGoogle,
        loginWithFacebook,
        register,
        logout,
        updateProfile,
        changePassword,
        addAddress,
        updateAddress,
        removeAddress,
        toggleFavorite,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) return {} as AuthCtx
  return ctx
}
