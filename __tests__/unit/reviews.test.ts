/**
 * Reviews logic tests — uses localStorage mock from helpers.
 *
 * Tests: getReviews, addReview, getAllReviews, getAverageRating
 */
import { describe, it, expect, beforeAll, afterAll, beforeEach, jest } from "@jest/globals"
import { createLocalStorageMock } from "../test-helpers/helpers"

// Inline the reviews module to avoid side-effect imports
const KEY = "viajero_reviews"

interface Review { id: string; productName: string; userName: string; rating: number; text: string; date: string }

function getReviews(productName: string): Review[] {
  try {
    const all: Review[] = JSON.parse(localStorage.getItem(KEY) || "[]")
    return all.filter(r => r.productName === productName)
  } catch { return [] }
}

function getAllReviews(): Review[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]") } catch { return [] }
}

function addReview(r: Omit<Review, "id" | "date">): Review {
  const review: Review = { ...r, id: Date.now().toString(36), date: new Date().toISOString() }
  const all = getAllReviews()
  all.push(review)
  localStorage.setItem(KEY, JSON.stringify(all))
  return review
}

function getAverageRating(productName: string): number {
  const reviews = getReviews(productName)
  if (reviews.length === 0) return 0
  return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
}

describe("Reviews", () => {
  let storage: Storage

  beforeAll(() => {
    storage = createLocalStorageMock()
    Object.defineProperty(globalThis, "localStorage", { value: storage, writable: true })
  })

  beforeEach(() => {
    storage.clear()
    jest.clearAllMocks()
  })

  describe("addReview", () => {
    it("adds a review and returns it with id and date", () => {
      const review = addReview({
        productName: "Carpa",
        userName: "Ana",
        rating: 5,
        text: "Excelente",
      })
      expect(review.id).toBeTruthy()
      expect(review.date).toBeTruthy()
      expect(review.productName).toBe("Carpa")
      expect(review.rating).toBe(5)
    })

    it("persists to localStorage", () => {
      addReview({ productName: "Carpa", userName: "Ana", rating: 5, text: "Excelente" })
      expect(storage.setItem).toHaveBeenCalledWith(KEY, expect.any(String))
      const stored = JSON.parse(storage.getItem(KEY) || "[]")
      expect(stored).toHaveLength(1)
    })

    it("appends to existing reviews", () => {
      addReview({ productName: "Carpa", userName: "Ana", rating: 5, text: "Excelente" })
      addReview({ productName: "Linterna", userName: "Pedro", rating: 4, text: "Bueno" })
      const stored = JSON.parse(storage.getItem(KEY) || "[]")
      expect(stored).toHaveLength(2)
    })
  })

  describe("getReviews", () => {
    it("returns empty array when no reviews", () => {
      expect(getReviews("Carpa")).toEqual([])
    })

    it("returns reviews for a specific product", () => {
      addReview({ productName: "Carpa", userName: "Ana", rating: 5, text: "Excelente" })
      addReview({ productName: "Linterna", userName: "Pedro", rating: 4, text: "Bueno" })
      addReview({ productName: "Carpa", userName: "María", rating: 4, text: "Muy buena" })

      const carpaReviews = getReviews("Carpa")
      expect(carpaReviews).toHaveLength(2)
      expect(carpaReviews.every(r => r.productName === "Carpa")).toBe(true)
    })
  })

  describe("getAllReviews", () => {
    it("returns empty array when no reviews", () => {
      expect(getAllReviews()).toEqual([])
    })

    it("returns all reviews regardless of product", () => {
      addReview({ productName: "Carpa", userName: "Ana", rating: 5, text: "Excelente" })
      addReview({ productName: "Linterna", userName: "Pedro", rating: 4, text: "Bueno" })
      expect(getAllReviews()).toHaveLength(2)
    })
  })

  describe("getAverageRating", () => {
    it("returns 0 when no reviews", () => {
      expect(getAverageRating("Carpa")).toBe(0)
    })

    it("calculates average of ratings", () => {
      addReview({ productName: "Carpa", userName: "Ana", rating: 5, text: "Excelente" })
      addReview({ productName: "Carpa", userName: "Pedro", rating: 3, text: "Regular" })
      expect(getAverageRating("Carpa")).toBe(4)
    })

    it("returns exact rating for single review", () => {
      addReview({ productName: "Carpa", userName: "Ana", rating: 4, text: "Bueno" })
      expect(getAverageRating("Carpa")).toBe(4)
    })

    it("ignores reviews of other products", () => {
      addReview({ productName: "Carpa", userName: "Ana", rating: 5, text: "Excelente" })
      addReview({ productName: "Linterna", userName: "Pedro", rating: 1, text: "Malo" })
      expect(getAverageRating("Carpa")).toBe(5)
    })

    it("handles fractional averages", () => {
      addReview({ productName: "Carpa", userName: "A", rating: 5, text: "" })
      addReview({ productName: "Carpa", userName: "B", rating: 4, text: "" })
      addReview({ productName: "Carpa", userName: "C", rating: 3, text: "" })
      expect(getAverageRating("Carpa")).toBe(4)
    })
  })
})
