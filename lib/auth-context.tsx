// Re-export from new modular structure (backward compatibility)
"use client"
export { AuthProvider } from "./auth/auth-context"
export { useAuth } from "./auth/auth-context"
export type { User, Address, Order, OrderItem } from "./auth/types"
