import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "paragu-ai.com"
