
"use client"
import { useEffect } from "react"

export function LocalStorageMigrator() {
  useEffect(() => {
    try {
      const users = localStorage.getItem("viajero_users")
      if (!users) return
      const parsed = JSON.parse(users)
      if (!Array.isArray(parsed) || parsed.length === 0) return
      
      // Migrate each user to DB silently
      parsed.forEach((u: any) => {
        fetch("/api/auth", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "migrate_user",
            id: u.id, name: u.name, email: u.email, password: u.password, phone: u.phone || "",
          }),
        }).catch(() => {})
      })
      
      // Don't clear localStorage until migration confirms
      console.log("LocalStorage users queued for DB migration:", parsed.length)
    } catch {}
  }, [])
  return null
}
