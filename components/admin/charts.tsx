
"use client"

interface BarChartProps {
  data: { label: string; value: number; color?: string }[]
  height?: number
  title?: string
}

export function BarChart({ data, height = 200, title }: BarChartProps) {
  const max = Math.max(...data.map(d => d.value), 1)
  const barWidth = Math.max(20, Math.min(60, 600 / data.length - 8))

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
      {title && <h3 className="mb-4 text-sm font-semibold text-gray-300">{title}</h3>}
      <div className="flex items-end gap-2" style={{ height }}>
        {data.map((d, i) => (
          <div key={i} className="flex flex-col items-center flex-1">
            <span className="text-[10px] text-gray-500 mb-1">{d.value}</span>
            <div
              className="w-full rounded-t transition-all duration-500 hover:opacity-80"
              style={{
                height: Math.max(4, (d.value / max) * (height - 30)),
                backgroundColor: d.color || "#22c55e",
                maxWidth: barWidth + "px",
              }}
            />
            <span className="text-[9px] text-gray-500 mt-1 truncate w-full text-center">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function StatCard({ label, value, sub, color = "text-green-400" }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={"text-2xl font-bold mt-1 " + color}>{value}</p>
      {sub && <p className="text-[10px] text-gray-600 mt-1">{sub}</p>}
    </div>
  )
}
