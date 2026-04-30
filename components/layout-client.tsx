
"use client"
import { OfflineIndicator } from "@/components/offline-indicator"

export function LayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <>
      <OfflineIndicator />
      {children}
    </>
  )
}
