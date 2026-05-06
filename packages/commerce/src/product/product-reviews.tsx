"use client"
import { useState } from "react"

export function ProductReviews({ productId }: { productId: string }) {
  const [rating, setRating] = useState(0)
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">Reseñas disponibles próximamente</p>
    </div>
  )
}
