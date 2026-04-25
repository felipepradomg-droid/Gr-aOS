'use client'

import { useState } from 'react'
import { CheckCircle, Clock, AlertCircle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface BankTransaction {
  id: string
  transactionDate: Date | string
  description: string
  amount: number
  counterpartName?: string | null
  paymentType?: string | null
  reconciliationStatus: string
  confidenceScore?: number | null
  receivable?: {
    id: string
    clienteNome: string
    amount: number
    paymentMethod: string
  } | null
}

interface Props {
  transactions: BankTransaction[]
  onConciliar?: (transactionId: string, receivableId: string) => Promise<void>
  onIgnorar?: (transactionId: string) => Promise<void>
  onAtualizar?: () => void
}

const STATUS_CONFIG: Record<string, {
  label: string
  color: string
  bg: string
  icon: React.ReactNode
}> = {
  pending: {
    label: 'Pendente',
    color: 'text-yellow-700',
    bg: 'bg-yellow-100',
    icon: <Clock className="h-3 w-3" />,
  },
  matched: {
    label: 'Conciliado',
    color: 'text-green-700',
    bg: 'bg-green-100',
    icon: <CheckCircle className="h-3 w-3" />,
  },
  manually_matched: {
    label: 'Conciliado Manual',
    color: 'text-blue-700',
    bg: 'bg-blue-100',
    icon: <CheckCircle className="h-3 w-3" />,
  },
  ignored: {
    label: 'Ignorado',
    color: 'text-gray-500',
    bg: 'bg-gray-100',
    icon: <AlertCircle className="h-3 w-3" />,
  },
}

function ScoreBadge({ score }: { score: number }) {
  const percent = Math.round(score * 100)
  const color =
    percent >= 90 ? 'text-green-700 bg-green-100' :
    percent >= 70 ? 'text-yellow-700 bg-yellow-100' :
    'text-red-700 bg-red-100'

  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${color}`}>
      {percent}% match
    </span>
  )
}

function TransactionRow({
  tx,
  onConciliar,
  onIgnorar,
}: {
  tx: BankTransaction
  onConciliar?: Props['onConciliar']
  onIgnorar?: Props['onIgnorar']
}) {
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(false)

  const status = STATUS_CONFIG[tx.reconciliationStatus] ?? STATUS_CONFIG.pending
  const isPendente = tx.reconciliationStatus === 'pending'
  const isCredito = tx.amount > 0

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Linha principal */}
      <div
        className="flex items-center justify-between gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-2 h-2 rounded-full shrink-0 ${isCredito ? 'bg-green-400' : 'bg-red-400'}`} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {tx.counterpartName || tx.description}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {formatDate(tx.transactionDate as string)}
              {tx.paymentType && ` · ${tx.paymentType.toUpperCase()}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <p className={`text-sm font-bold ${isCredito ? 'text-green-600' : 'text-red-600'}`}>
            {isCredito ? '+' : ''}{formatCurrency(tx.amount)}
          </p>
          <span className={`hidden sm:flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}>
            {status.icon}
            {status.label}
          </span>
          {expanded
            ? <ChevronUp className="h-4 w-4 text-gray-400" />
            : <ChevronDown className="h-4 w-4 text-gray-400" />
          }
        </div>
      </div>

      {/* Expandido */}
      {expanded && (
        <div className="border-t border-gray-100 p-4 space-y-3 bg-gray-50">
          <p className="text-xs text-gray-500 leading-relaxed">{tx.description}</p>

          {/* Match encontrado */}
          {tx.receivable && (
            <div className="bg-white rounded-lg border border-gray-200 p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-700">Match encontrado</p>
                {tx.confidenceScore && <ScoreBadge score={tx.confidenceScore} />}
              </div>
              <p className="text-xs text-gray-600">
                {tx.receivable.clienteNome} · {formatCurrency(tx.receivable.amount)} · {tx.receivable.paymentMethod.toUpperCase()}
              </p>
            </div>
          )}

          {/* Ações */}
          {isPendente && (
            <div className="flex items-center gap-2">
              {tx.receivable && onConciliar && (
                <button
                  disabled={loading}
                  onClick={async () => {
                    setLoading(true)
                    await onConciliar(tx.id, tx.receivable!.id)
                    setLoading(false)
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  <CheckCircle className="h-3 w-3" />
                  {loading ? 'Conciliando...' : 'Confirmar Match'}
                </button>
              )}
              {onIgnorar && (
                <button
                  disabled={loading}
                  onClick={async () => {
                    setLoading(true)
                    await onIgnorar(tx.id)
                    setLoading(false)
                  }}
                  className="flex items-center gap-1.5 text-xs font-medium text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-white transition-colors disabled:opacity-50"
                >
                  Ignorar
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function BankReconciliation({ transactions, onConciliar, onIgnorar, onAtualizar }: Props) {
  const pendentes = transactions.filter(t => t.reconciliationStatus === 'pending').length
  const conciliados = transactions.filter(t => t.reconciliationStatus === 'matched' || t.reconciliationStatus === 'manually_matched').length

  return (
    <div className="space-y-4">
      {/* Header com resumo */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-yellow-700 bg-yellow-100 px-2.5 py-1 rounded-full font-medium">
            <Clock className="h-3 w-3" />
            {pendentes} pendentes
          </div>
          <div className="flex items-center gap-1.5 text-xs text-green-700 bg-green-100 px-2.5 py-1 rounded-full font-medium">
            <CheckCircle className="h-3 w-3" />
            {conciliados} conciliados
          </div>
        </div>
        {onAtualizar && (
          <button
            onClick={onAtualizar}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
            Atualizar
          </button>
        )}
      </div>

      {/* Lista de transações */}
      {transactions.length === 0 ? (
        <div className="text-center py-10 text-sm text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
          Nenhuma transação encontrada
        </div>
      ) : (
        <div className="space-y-2">
          {transactions.map(tx => (
            <TransactionRow
              key={tx.id}
              tx={tx}
              onConciliar={onConciliar}
              onIgnorar={onIgnorar}
            />
          ))}
        </div>
      )}
    </div>
  )
}
