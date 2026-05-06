"use client"

import { cn } from "./cn"
import { cva, type VariantProps } from "class-variance-authority"

const skeletonVariants = cva(
  "animate-pulse bg-surface-light rounded-md",
  {
    variants: {
      variant: {
        default: "",
        text: "h-4 w-full",
        avatar: "h-10 w-10 rounded-full",
        image: "aspect-video w-full",
        card: "h-32 w-full",
        circle: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  rows?: number
}

export function Skeleton({
  className,
  variant,
  rows = 1,
  ...props
}: SkeletonProps) {
  if (rows > 1) {
    return (
      <div className="space-y-2" {...props}>
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className={cn(skeletonVariants({ variant }), className)}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(skeletonVariants({ variant }), className)}
      {...props}
    />
  )
}

// Pre-built skeleton components for common use cases
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-4", i === lines - 1 ? "w-3/4" : "w-full")}
        />
      ))}
    </div>
  )
}

export function SkeletonTableRow({ columns = 4 }: { columns?: number }) {
  return (
    <div className="flex items-center space-x-4 py-3">
      <Skeleton variant="avatar" />
      {Array.from({ length: columns - 1 }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
  )
}

export function SkeletonCard({ hasImage = true }: { hasImage?: boolean }) {
  return (
    <div className="space-y-3">
      {hasImage && <Skeleton variant="image" />}
      <Skeleton className="h-5 w-2/3" />
      <SkeletonText lines={2} />
    </div>
  )
}
