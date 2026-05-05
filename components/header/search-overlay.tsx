"use client"
import { SearchAutocomplete } from "@/components/search-autocomplete"

export function SearchOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20" onClick={onClose}>
      <div className="w-full max-w-xl px-4" onClick={(e) => e.stopPropagation()}>
        <SearchAutocomplete />
      </div>
    </div>
  )
}
