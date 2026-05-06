"use client"
import { AuthProvider } from "@ai-whisperers/auth/auth-context"

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}
