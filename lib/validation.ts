import { z } from "zod"

// ── Content overrides ─────────────────────────────────────────
export const ContentOverrideSchema = z.record(z.string(), z.unknown())

// ── Blog post ─────────────────────────────────────────────────
export const BlogPostSchema = z.object({
  slug: z.string().min(1, "El slug es requerido").regex(/^[a-z0-9-]+$/, "El slug solo puede contener letras minúsculas, números y guiones"),
  title: z.string().min(1, "El título es requerido"),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  category: z.string().optional(),
  image_url: z.string().optional(),
  author: z.string().optional(),
  published: z.boolean().optional(),
  created_at: z.string().optional(),
})

// ── Staff role ────────────────────────────────────────────────
export const ALLOWED_ROLES = ["admin", "staff", "user", "guest"] as const
export const StaffRoleSchema = z.enum(ALLOWED_ROLES)

// ── Order status ─────────────────────────────────────────────
export const ORDER_STATUSES = [
  "pendiente",
  "confirmado",
  "procesando",
  "enviado",
  "entregado",
  "cancelado",
] as const
export const OrderStatusSchema = z.enum(ORDER_STATUSES)

// ── Payment status ───────────────────────────────────────────
export const PAYMENT_STATUSES = ["pending", "verified", "rejected", "refunded"] as const
export const PaymentStatusSchema = z.enum(PAYMENT_STATUSES)
