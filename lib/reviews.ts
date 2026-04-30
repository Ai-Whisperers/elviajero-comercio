export interface Review {
  id: string
  productName: string
  userName: string
  rating: number
  text: string
  date: string
}

const KEY = "viajero_reviews"

export function getReviews(productName: string): Review[] {
  try {
    const all: Review[] = JSON.parse(localStorage.getItem(KEY) || "[]")
    return all.filter((r) => r.productName === productName)
  } catch { return [] }
}

export function getAllReviews(): Review[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]") } catch { return [] }
}

export function addReview(r: Omit<Review, "id" | "date">): Review {
  const review: Review = { ...r, id: Date.now().toString(36), date: new Date().toISOString() }
  const all = getAllReviews()
  all.push(review)
  localStorage.setItem(KEY, JSON.stringify(all))
  return review
}

export function getAverageRating(productName: string): number {
  const reviews = getReviews(productName)
  if (reviews.length === 0) return 0
  return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
}
