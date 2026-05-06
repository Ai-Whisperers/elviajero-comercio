"use client"

import * as React from "react"
import { cn } from "./cn"
import { cva, type VariantProps } from "class-variance-authority"

const filterBadgeVariants = cva(
  "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full transition-all cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-secondary text-white hover:bg-secondary/90",
        secondary: "border-2 border-secondary text-secondary bg-transparent hover:bg-secondary hover:text-white",
        outline: "border-2 border-muted-foreground text-foreground bg-transparent hover:bg-surface-light",
        muted: "bg-surface-light text-foreground hover:bg-surface",
        success: "bg-[var(--color-success)] text-white",
        destructive: "bg-[var(--color-error)] text-white",
        warning: "bg-[var(--color-warning)] text-white",
        info: "bg-[var(--color-info)] text-white",
      },
      size: {
        sm: "px-2 py-1 text-xs",
        md: "px-3 py-1.5 text-sm",
        lg: "px-4 py-2 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface FilterBadgeProps
  extends Omit<React.HTMLAttributes<HTMLButtonElement>, "onChange">,
    VariantProps<typeof filterBadgeVariants> {
  label: string
  value: string
  isActive?: boolean
  onChange?: (value: string, isActive: boolean) => void
  onRemove?: (value: string) => void
  removable?: boolean
  count?: number
}

export function FilterBadge({
  className,
  variant,
  size,
  label,
  value,
  isActive = false,
  onChange,
  onRemove,
  removable = true,
  count,
  ...props
}: FilterBadgeProps) {
  const handleClick = () => {
    onChange?.(value, !isActive)
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onRemove?.(value)
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        filterBadgeVariants({ variant: isActive ? "default" : "outline", size }),
        !isActive && "opacity-70 hover:opacity-100",
        className
      )}
      aria-pressed={isActive}
      {...props}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span className="text-xs opacity-70">({count})</span>
      )}
      {isActive && removable && (
        <span
          onClick={handleRemove}
          className="ml-1 p-0.5 rounded-full hover:bg-white/20 cursor-pointer"
          role="button"
          aria-label={`Remove ${label} filter`}
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </span>
      )}
    </button>
  )
}

// Filter Badge Group
export interface FilterBadgeGroupProps {
  options: Array<{
    label: string
    value: string
    count?: number
  }>
  activeValues: string[]
  onChange: (values: string[]) => void
  variant?: "default" | "outline" | "muted"
  size?: "sm" | "md" | "lg"
  multiple?: boolean
  className?: string
}

export function FilterBadgeGroup({
  options,
  activeValues,
  onChange,
  variant,
  size,
  multiple = true,
  className,
}: FilterBadgeGroupProps) {
  const handleToggle = (value: string, isActive: boolean) => {
    if (multiple) {
      if (isActive) {
        onChange([...activeValues, value])
      } else {
        onChange(activeValues.filter((v) => v !== value))
      }
    } else {
      onChange(isActive ? [value] : [])
    }
  }

  const handleRemove = (value: string) => {
    onChange(activeValues.filter((v) => v !== value))
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)} role="group" aria-label="Filter options">
      {options.map((option) => (
        <FilterBadge
          key={option.value}
          label={option.label}
          value={option.value}
          count={option.count}
          isActive={activeValues.includes(option.value)}
          onChange={handleToggle}
          onRemove={handleRemove}
          variant={variant}
          size={size}
        />
      ))}
    </div>
  )
}

// Legacy Badge export for backwards compatibility
// This is a simpler badge component without filter functionality
const legacyBadgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-secondary text-white",
        secondary: "border border-secondary text-secondary bg-transparent",
        outline: "border border-muted-foreground text-foreground",
        muted: "bg-surface-light text-muted-foreground",
        success: "bg-success text-white",
        destructive: "bg-red-600 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof legacyBadgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(legacyBadgeVariants({ variant }), className)} {...props} />
}
