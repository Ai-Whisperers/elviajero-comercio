"use client"
import { useState } from "react"

interface Tab { id: string; label: string; content: React.ReactNode }

interface Props { tabs: Tab[]; defaultTab?: string }

export function ProductTabs({ tabs, defaultTab }: Props) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.id || "")

  return (
    <div className="mt-12">
      <div className="flex border-b border-border overflow-x-auto">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActive(tab.id)}
            className={"px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all -mb-[1px] " +
              (active === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}>
            {tab.label}
          </button>
        ))}
      </div>
      <div className="pt-6">
        {tabs.find((t) => t.id === active)?.content}
      </div>
    </div>
  )
}
