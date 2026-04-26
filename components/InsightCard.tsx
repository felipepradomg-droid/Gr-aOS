'use client'

import { AlertTriangle, TrendingUp, TrendingDown, Lightbulb, CheckCircle, ExternalLink, Send } from 'lucide-react'
import Link from 'next/link'

interface Insight {
  id: string
  type: 'warning' | 'opportunity' | 'info' | 'success'
  title: string
  description: string
  action?: string
  actionUrl?: string
  whatsappUrl?: string
  value?: number
  priority: number
}

interface Props {
  insight: Insight
}

const TYPE_CONFIG = {
  warning: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: <AlertTriangle className="h-4 w-4 text-red-600" />,
    actionBg: 'bg-red-600 hover:bg-red-700',
  },
  opportunity: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    icon: <Lightbulb className="h-4 w-4 text-orange-600" />,
    actionBg: 'bg-orange-500 hover:bg-orange-600',
  },
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: <CheckCircle className="h-4 w-4 text-green-600" />,
    actionBg: 'bg-green-600 hover:bg-green-700',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: <TrendingUp className="h-4 w-4 text-blue-600" />,
    actionBg: 'bg-blue-600 hover:bg-blue-700',
  },
}

export function InsightCard({ insight }: Props) {
  const config = TYPE_CONFIG[insight.type]

  return (
    <div className={`rounded-xl border p-4 space-y-3 ${config.bg} ${config.border}`}>
      {/* Header */}
      <div className="flex items-start gap-2">
        <div className="mt-0.5 shrink-0">{config.icon}</div>
        <p className="text-sm font-semibold text-gray-800 leading-tight">
          {insight.title}
        </p>
      </div>

      {/* Descrição */}
      <p className="text-xs text-gray-600 leading-relaxed pl-6">
        {insight.description}
      </p>

      {/* Ações */}
      {(insight.actionUrl || insight.whatsappUrl) && (
        <div className="flex items-center gap-2 pl-6 flex-wrap">
          {insight.actionUrl && (
            <Link href={insight.actionUrl}>
              <button className={`flex items-center gap-1.5 text-xs font-semibold text-white px-3 py-1.5 rounded-lg transition-colors ${config.actionBg}`}>
                <ExternalLink className="h-3 w-3" />
                {insight.action || 'Ver mais'}
              </button>
            </Link>
          )}
          {insight.whatsappUrl && (
            <a
              href={insight.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              <Send className="h-3 w-3" />
              WhatsApp
            </a>
          )}
        </div>
      )}
    </div>
  )
}
