'use client'

import { useState } from 'react'
import { FileText, Send, CheckCircle, Clock, XCircle, AlertCircle, ExternalLink } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface Invoice {
  id: string
  invoiceNumber: string
  clienteNome: string
  clienteTel?: string | null
  clienteEmail?: string | null
  clienteCnpjCpf?: string | null
  status: string
  totalAmount: number
  dueDate: Date | string
  nfseNumber?: string | null
  nfsePdfUrl?: string | null
  emittedAt?: Date | string | null
  errorMessage?: string | null
  municipalityConfig?: {
    cityName: string
    state: string
  } | null
}

interface Props {
  invoice: Invoice
  onEmitir?: (id: string) => Promise<{ whatsappUrl?: string | null }>
}

const STATUS_CONFIG: Record<string, {
  label: string
  color: string
  bg: string
  icon: React.ReactNode
}> = {
  draft: {
    label: 'Rascunho',
    color: 'text-gray-600',
    bg: 'bg-gray-100',
    icon: <FileText className="h-3 w-3" />,
  },
  pending_emission: {
    label: 'Emitindo...',
    color: 'text-yellow-700',
    bg: 'bg-yellow-100',
    icon: <Clock className="h-3 w-3" />,
  },
  emitted: {
    label: 'NFS-e Emitida',
    color: 'text-green-700',
    bg: 'bg-green-100',
    icon: <CheckCircle className="h-3 w-3" />,
  },
  paid: {
    label: 'Paga',
    color: 'text-blue-700',
    bg: 'bg-blue-100',
    icon: <CheckCircle className="h-3 w-3" />,
  },
  cancelled: {
    label: 'Cancelada',
    color: 'text-red-600',
    bg: 'bg-red-100',
    icon: <XCircle className="h-3 w-3" />,
  },
  error: {
    label: 'Erro',
    color: 'text-red-700',
    bg: 'bg-red-100',
    icon: <AlertCircle className="h-3 w-3" />,
  },
}

export function InvoiceCard({ invoice, onEmitir }: Props) {
  const [loading, setLoading] = useState(false)
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null)

  const status = STATUS_CONFIG[invoice.status] ?? STATUS_CONFIG.draft
  const podeEmitir = invoice.status === 'draft' || invoice.status === 'error'

  async function handleEmitir() {
    if (!onEmitir) return
    setLoading(true)
    try {
      const result = await onEmitir(invoice.id)
      if (result.whatsappUrl) {
        setWhatsappUrl(result.whatsappUrl)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-gray-300 transition-all space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-bold text-gray-400">{invoice.invoiceNumber}</p>
          <p className="text-sm font-semibold text-gray-800 mt-0.5 leading-tight">
            {invoice.clienteNome}
          </p>
          {invoice.clienteCnpjCpf && (
            <p className="text-xs text-gray-400 mt-0.5">{invoice.clienteCnpjCpf}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <p className="text-sm font-bold text-gray-900">
            {formatCurrency(invoice.totalAmount)}
          </p>
          <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}>
            {status.icon}
            {status.label}
          </span>
        </div>
      </div>

      {/* Detalhes */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Clock className="h-3 w-3 shrink-0" />
          <span>Vencimento: {formatDate(invoice.dueDate as string)}</span>
        </div>
        {invoice.municipalityConfig && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <FileText className="h-3 w-3 shrink-0" />
            <span>{invoice.municipalityConfig.cityName} — {invoice.municipalityConfig.state}</span>
          </div>
        )}
        {invoice.nfseNumber && (
          <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
            <CheckCircle className="h-3 w-3 shrink-0" />
            <span>NFS-e nº {invoice.nfseNumber}</span>
          </div>
        )}
        {invoice.errorMessage && (
          <div className="flex items-start gap-1.5 text-xs text-red-600">
            <AlertCircle className="h-3 w-3 shrink-0 mt-0.5" />
            <span className="leading-tight">{invoice.errorMessage}</span>
          </div>
        )}
      </div>

      {/* Ações */}
      <div className="flex items-center gap-2 pt-1">
        {podeEmitir && onEmitir && (
          <button
            onClick={handleEmitir}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs font-semibold bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <FileText className="h-3 w-3" />
            {loading ? 'Emitindo...' : 'Emitir NFS-e'}
          </button>
        )}
        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors"
          >
            <Send className="h-3 w-3" />
            Enviar WhatsApp
          </a>
        )}
        {invoice.nfsePdfUrl && (
          <a
            href={invoice.nfsePdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
            Ver PDF
          </a>
        )}
      </div>
    </div>
  )
}
