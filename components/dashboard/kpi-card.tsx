import { ReactNode } from 'react'

const COLOR_MAP: Record<string, string> = {
  blue: 'bg-blue-50 border-blue-200',
  amber: 'bg-amber-50 border-amber-200',
  green: 'bg-green-50 border-green-200',
  purple: 'bg-purple-50 border-purple-200',
  red: 'bg-red-50 border-red-200',
  gray: 'bg-gray-50 border-gray-200',
}

interface Props {
  title: string
  value: string
  subtitle?: string
  icon: ReactNode
  color: string
}

export function KPICard({ title, value, subtitle, icon, color }: Props) {
  return (
    <div className={`rounded-xl border p-4 ${COLOR_MAP[color] ?? COLOR_MAP.gray}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1 leading-none">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="p-2 rounded-lg bg-white/70">{icon}</div>
      </div>
    </div>
  )
}
