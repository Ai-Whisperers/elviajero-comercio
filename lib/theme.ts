// ── Brand theme tokens for El Viajero ──
// Single source of truth for colors, spacing, typography, and layout.
// Consumed by components, Tailwind safelist (via tailwind.config.ts), and inline styles.
// Inspired by @ai-whisperers/sections pattern from Nexa.

export const BRAND = {
  name: 'El Viajero',
  colors: {
    primary: '#1B5E20',      // Deep green — main brand
    primaryLight: '#2E7D32',
    primaryDark: '#0D3B0F',
    secondary: '#E65100',    // Orange — accent CTA
    secondaryLight: '#EF6C00',
    secondaryDark: '#BF360C',
    accent: '#1565C0',        // Blue — info/secondary links
    background: '#FAFAFA',
    surface: '#FFFFFF',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    error: '#DC2626',
    success: '#16A34A',
    warning: '#F59E0B',
  },
  fonts: {
    body: "'Inter', sans-serif",
    heading: "'Inter', sans-serif",
  },
  spacing: {
    section: 'py-16 md:py-24',
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  },
  whatsapp: {
    phone: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+595****4567',
    message: 'Hola! Quisiera información sobre productos',
  },
} as const

export const TW = {
  // Tailwind class utilities for reuse
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  section: 'py-16 md:py-24',
  flexCenter: 'flex items-center justify-center',
  flexBetween: 'flex items-center justify-between',
  card: 'bg-white rounded-lg shadow-sm border border-gray-200 p-6',
  btnPrimary: 'bg-[--color-primary] text-white px-6 py-3 rounded-lg font-medium hover:bg-[--color-primary-dark] transition-colors',
  btnSecondary: 'bg-[--color-secondary] text-white px-6 py-3 rounded-lg font-medium hover:bg-[--color-secondary-dark] transition-colors',
}

export function getBrandColor(cssVar: string): string {
  // Maps CSS variable names to hex values
  const map: Record<string, string> = {
    '--color-primary': BRAND.colors.primary,
    '--color-primary-light': BRAND.colors.primaryLight,
    '--color-secondary': BRAND.colors.secondary,
    '--color-accent': BRAND.colors.accent,
  }
  return map[cssVar] || BRAND.colors.primary
}
