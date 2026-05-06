"use client"

import * as React from "react"
import { cn } from "./cn"
import { cva, type VariantProps } from "class-variance-authority"

const toastVariants = cva(
  "fixed z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 pointer-events-auto",
  {
    variants: {
      variant: {
        default: "bg-surface text-foreground border border-border",
        success: "bg-success text-white",
        error: "bg-[var(--error)] text-white",
        warning: "bg-[var(--warning)] text-white",
        info: "bg-secondary text-white",
      },
      position: {
        "top-right": "top-4 right-4",
        "top-left": "top-4 left-4",
        "top-center": "top-4 left-1/2 -translate-x-1/2",
        "bottom-right": "bottom-4 right-4",
        "bottom-left": "bottom-4 left-4",
        "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
      },
    },
    defaultVariants: {
      variant: "default",
      position: "bottom-right",
    },
  }
)

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  title?: string
  description?: string
  onClose?: () => void
  duration?: number
  icon?: React.ReactNode
}

export function Toast({
  className,
  variant,
  position,
  title,
  description,
  onClose,
  duration = 5000,
  icon,
  ...props
}: ToastProps) {
  React.useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  return (
    <div
      className={cn(toastVariants({ variant, position }), className)}
      role="alert"
      {...props}
    >
      {icon && <div className="flex-shrink-0">{icon}</div>}
      <div className="flex-1 min-w-0">
        {title && <div className="font-medium text-sm">{title}</div>}
        {description && (
          <div className="text-sm opacity-90">{description}</div>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 rounded hover:bg-white/20 transition-colors"
          aria-label="Close notification"
        >
          <svg
            className="w-4 h-4"
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
        </button>
      )}
    </div>
  )
}

// Toast Container for managing multiple toasts
interface ToastContainerProps {
  children: React.ReactNode
  position?: "top-right" | "top-left" | "top-center" | "bottom-right" | "bottom-left" | "bottom-center"
}

export function ToastContainer({ children, position = "bottom-right" }: ToastContainerProps) {
  const getPositionClasses = () => {
    switch (position) {
      case "top-right":
        return "top-4 right-4"
      case "top-left":
        return "top-4 left-4"
      case "top-center":
        return "top-4 left-1/2 -translate-x-1/2"
      case "bottom-right":
        return "bottom-4 right-4"
      case "bottom-left":
        return "bottom-4 left-4"
      case "bottom-center":
        return "bottom-4 left-1/2 -translate-x-1/2"
    }
  }

  return (
    <div
      className={cn(
        "fixed z-50 flex flex-col gap-2 pointer-events-none",
        getPositionClasses()
      )}
      aria-live="polite"
      aria-atomic="true"
    >
      {children}
    </div>
  )
}

// Hook for toast state management
export function useToast() {
  const [toasts, setToasts] = React.useState<Array<{ id: string; props: ToastProps }>>([])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = React.useCallback((props: Omit<ToastProps, "onClose">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, props: { ...props, onClose: () => removeToast(id) } }])
    return id
  }, [removeToast])

  const clearToasts = React.useCallback(() => {
    setToasts([])
  }, [])

  return { toasts, addToast, removeToast, clearToasts }
}
