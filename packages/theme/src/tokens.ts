// Design tokens as CSS variables
import { colors } from './colors'
import { fonts } from './fonts'

export function generateCSSVars(scheme: 'storefront' | 'admin' | 'dark' = 'storefront'): Record<string, string> {
  const c = colors[scheme]
  return {
    '--color-primary': c.primary,
    '--color-primary-foreground': c.primaryForeground,
    '--color-background': c.background,
    '--color-foreground': c.foreground,
    '--color-muted': c.muted,
    '--color-muted-foreground': c.mutedForeground,
    '--color-border': c.border,
    '--color-card': c.card,
    '--color-card-foreground': c.foreground,
    '--color-ring': c.ring,
    '--color-destructive': c.destructive,
    '--color-success': c.success,
    '--color-warning': c.warning,
    '--font-sans': fonts.sans,
    '--font-heading': fonts.heading,
  }
}

export { colors, fonts }
