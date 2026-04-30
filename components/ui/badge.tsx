import { cn } from "@/lib/utils"

export function Badge({ className, variant = "default", ...props }: { className?: string; variant?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn(
      "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors",
      variant === "outline" ? "border-border text-muted-foreground" : "bg-primary text-primary-foreground",
      className
    )} {...props} />
  )
}
