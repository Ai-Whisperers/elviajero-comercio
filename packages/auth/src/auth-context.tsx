"use client"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { createClient } from "./supabase/browser"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import type { User } from "./types"
import { useAuthOrders } from "./orders-hooks"
import { useAuthAddresses } from "./address-hooks"
import { useAuthFavorites } from "./favorites"

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
  addresses: import("./types").Address[]
  addAddress: (a: Omit<import("./types").Address, "id">) => Promise<{ ok: boolean; error?: string }>
  updateAddress: (id: string, a: Partial<import("./types").Address>) => Promise<{ ok: boolean; error?: string }>
  removeAddress: (id: string) => Promise<void>
  orders: import("./types").Order[]
  refreshOrders: () => Promise<void>
  addOrder: (o: Omit<import("./types").Order, "id" | "date" | "status">) => Promise<string>
  favorites: string[]
  toggleFavorite: (productName: string) => void
  isFavorite: (productName: string) => boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [supabase] = useState(() => createClient())

  const { orders, setOrders, refreshOrders, addOrder } = useAuthOrders(supabase, user)
  const { addresses, setAddresses, loadAddresses, addAddress, updateAddress, removeAddress } = useAuthAddresses(supabase, user)
  const { favorites, setFavorites, initFavorites, toggleFavorite, isFavorite } = useAuthFavorites()

  const fetchProfile = useCallback(async (supabaseUser: SupabaseUser) => {
    try {
      const { data } = await supabase.from("profiles").select("*").eq("id", supabaseUser.id).single()
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
  }, [supabase, fetchProfile, loadAddresses, refreshOrders, setAddresses, setOrders])

  useEffect(() => { if (user) { loadAddresses(); refreshOrders(); initFavorites(user) } else { initFavorites(null) } }, [user])

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { ok: false, error: error.message === "Invalid login credentials" ? "Credenciales incorrectas" : error.message }
    // Store session in localStorage for admin layout fallback
    if (data?.session) {
      localStorage.setItem("elviajero_admin_session", JSON.stringify({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      }))
    }
    return { ok: true }
  }, [supabase])

  const register = useCallback(async (name: string, email: string, password: string, phone: string) => {
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { name, phone } } })
    if (error) return { ok: false, error: error.message.includes("already registered") ? "Email ya registrado" : error.message }
    return { ok: true }
  }, [supabase])

  const loginWithGoogle = useCallback(async () => {
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/auth/callback` } })
  }, [supabase])

  const loginWithFacebook = useCallback(async () => {
    await supabase.auth.signInWithOAuth({ provider: "facebook", options: { redirectTo: `${window.location.origin}/auth/callback` } })
  }, [supabase])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null); setAddresses([]); setOrders([]); setFavorites([])
  }, [supabase, setAddresses, setOrders, setFavorites])

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

  const wrappedToggle = useCallback((productName: string) => toggleFavorite(productName, user), [toggleFavorite, user])

  return (
    <AuthContext.Provider value={{
      user, loading, login, register, loginWithGoogle, loginWithFacebook, logout, updateProfile, changePassword,
      addresses, addAddress, updateAddress, removeAddress,
      orders, refreshOrders, addOrder,
      favorites, toggleFavorite: wrappedToggle, isFavorite,
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
