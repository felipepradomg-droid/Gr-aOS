'use client'

import { useState } from 'react'
import { Copy, Send, CheckCircle, Clock, XCircle, AlertCircle, QrCode, FileText } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface Receivable {
  id: string
  clienteNome: string
  clienteCnpjCpf?: string | null
  paymentMethod: string
  amount: number
  dueDate: Date | string
  status: string
  paidAmount?: number | null
  paidAt?: Date | string | null
  barcode?: string | null
  pixKey?: string | null
  pixQrcode?: string | null
  paymentUrl?: string | null
  fineAmount: number
  interestAmount: number
  invoice?: {
    invoiceNumber: string
    totalAmount: number
  } | null
}

interface Props {
  receivable: Receivable
}

const STATUS_CONFIG: Record<string, {
  label: string
  color: string
  bg: string
  icon: React.ReactNode
}> = {
  pending: {
    label: 'Aguardando',
    color: 'text-yellow-700',
    bg: 'bg-yellow-100',
    icon: <Clock className="h-3 w-3" />,
  },
  sent: {
    label: 'Enviado',
    color: 'text-blue-700',
    bg: 'bg-blue-100',
    icon: <Send className="h-3 w-3" />,
  },
  paid: {
    label: 'Pago',
    color: 'text-green-700',
    bg: 'bg-green-100',
    icon: <CheckCircle className="h-3 w-3" />,
  },
  overdue: {
    label: 'Vencido',
    color: 'text-red-700',
    bg: 'bg-red-100',
    icon: <AlertCircle className="h-3 w-3" />,
  },
  cancelled: {
    label: 'Cancelado',
    color: 'text-gray-600',
    bg: 'bg-gray-100',
    icon: <XCircle className="h-3 w-3" />,
  },
}

export function ReceivableCard({ receivable }: Props) {
  const [copied, setCopied] = useState(false)
  const [showQr, setShowQr] = useState(false)

  const status = STATUS_CONFIG[receivable.status] ?? STATUS_CONFIG.pending
  const isPix = receivable.paymentMethod === 'pix'
  const isPago = receivable.status === 'paid'

  async function copiarCodigo() {
    const codigo = isPix ? receivable.pixKey : receivable.barcode
    if (!codigo) return
    await navigator.clipboard.writeText(codigo)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function montarWhatsapp() {
    if (!receivable.paymentUrl) return null
    const mensagem = encodeURIComponent(
      `Olá ${receivable.clienteNome}! Segue seu ${isPix ? 'PIX' : 'Boleto'}.\n\n` +
      `Valor: ${formatCurrency(receivable.amount)}\n` +
      `Vencimento: ${formatDate(receivable.dueDate as string)}\n` +
      `\nLink: ${receivable.paymentUrl}`
    )
    return `https://wa.me/?text=${mensagem}`
  }

  const whatsappUrl = montarWhatsapp()

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-gray-300 transition-all space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5">
            {isPix
              ? <QrCode className="h-3.5 w-3.5 text-gray-400" />
              : <FileText className="h-3.5 w-3.5 text-gray-400" />
            }
            <p className="text-xs font-bold text-gray-400 uppercase">
              {isPix ? 'PIX' : 'Boleto'}
            </p>
          </div>
          <p className="text-sm font-semibold text-gray-800 mt-0.5 leading-tight">
            {receivable.clienteNome}
          </p>
          {receivable.invoice && (
            <p className="text-xs text-gray-400 mt-0.5">
              Ref: {receivable.invoice.invoiceNumber}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <p className="text-sm font-bold text-gray-900">
            {formatCurrency(receivable.amount)}
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
          <span>Vencimento: {formatDate(receivable.dueDate as string)}</span>
        </div>
        {isPago && receivable.paidAt && (
          <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
            <CheckCircle className="h-3 w-3 shrink-0" />
            <span>
              Pago em {formatDate(receivable.paidAt as string)}
              {receivable.paidAmount && ` — ${formatCurrency(receivable.paidAmount)}`}
            </span>
          </div>
        )}
        {receivable.status === 'overdue' && (
          <div className="flex items-center gap-1.5 text-xs text-red-600">
            <AlertCircle className="h-3 w-3 shrink-0" />
            <span>
              Multa: {formatCurrency(receivable.fineAmount)} | Juros: {formatCurrency(receivable.interestAmount)}
            </span>
          </div>
        )}
      </div>

      {/* QR Code PIX */}
      {isPix && receivable.pixQrcode && showQr && (
        <div className="flex justify-center p-3 bg-gray-50 rounded-lg border border-gray-200">
          <img
            src={`data:image/png;base64,${receivable.pixQrcode}`}
            alt="QR Code PIX"
            className="w-36 h-36"
          />
        </div>
      )}

      {/* Ações */}
      {!isPago && (
        <div className="flex items-center gap-2 pt-1 flex-wrap">
          {isPix && receivable.pixQrcode && (
            <button
              onClick={() => setShowQr(!showQr)}
              className="flex items-center gap-1.5 text-xs font-semibold bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <QrCode className="h-3 w-3" />
              {showQr ? 'Ocultar QR' : 'Ver QR Code'}
            </button>
          )}
          {(receivable.pixKey || receivable.barcode) && (
            <button
              onClick={copiarCodigo}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Copy className="h-3 w-3" />
              {copied ? 'Copiado!' : isPix ? 'Copiar Chave' : 'Copiar Código'}
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
              WhatsApp
            </a>
          )}
        </div>
      )}
    </div>
  )
}
