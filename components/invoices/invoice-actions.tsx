'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { markInvoicePaid, markInvoiceSent } from '@/lib/actions/invoices'
import { CheckCircle, Send, FileText, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  invoiceId: string
  status: string
  clienteCnpjCpf?: string | null
  nfseNumber?: string | null
  nfsePdfUrl?: string | null
}

export function InvoiceActions({ invoiceId, status, clienteCnpjCpf, nfseNumber, nfsePdfUrl }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [emitting, setEmitting] = useState(false)
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null)

  async function handleMarkPaid() {
    setLoading(true)
    const result = await markInvoicePaid(invoiceId)
    setLoading(false)
    if (result?.error) toast.error(result.error as string)
    else { toast.success('Fatura marcada como paga! 🎉'); router.refresh() }
  }

  async function handleMarkSent() {
    setLoading(true)
    const result = await markInvoiceSent(invoiceId)
    setLoading(false)
    if (result?.error) toast.error(result.error as string)
    else { toast.success('Fatura marcada como enviada!'); router.refresh() }
  }

  async function handleEmitirNfse() {
    if (!clienteCnpjCpf) {
      toast.error('CPF/CNPJ do cliente é obrigatório para emitir NFS-e')
      return
    }
    setEmitting(true)
    try {
      const res = await fetch(`/api/invoices/${invoiceId}/emit`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Erro ao emitir NFS-e')
        return
      }
      toast.success(`NFS-e ${data.nfse?.number} emitida com sucesso! 🎉`)
      if (data.whatsappUrl) setWhatsappUrl(data.whatsappUrl)
      router.refresh()
    } catch {
      toast.error('Erro ao emitir NFS-e')
    } finally {
      setEmitting(false)
    }
  }

  if (status === 'paid' || status === 'cancelled') return null

  return (
    <div className="flex flex-col gap-2">
      {/* NFS-e já emitida */}
      {nfseNumber && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-green-600 font-medium">NFS-e emitida</p>
            <p className="text-sm font-bold text-green-700">Nº {nfseNumber}</p>
          </div>
          {nfsePdfUrl && (
            <a
              href={nfsePdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-green-700 underline"
            >
              <ExternalLink className="h-3 w-3" />
              Ver PDF
            </a>
          )}
        </div>
      )}

      {/* Botão emitir NFS-e — só aparece se ainda não emitiu */}
      {status !== 'emitted' && (
        <button
          onClick={handleEmitirNfse}
          disabled={emitting || loading}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors text-sm font-medium disabled:opacity-50"
        >
          <FileText className="h-4 w-4" />
          {emitting ? 'Emitindo NFS-e...' : 'Emitir NFS-e'}
        </button>
      )}

      {/* Link WhatsApp após emissão */}
      {whatsappUrl && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors text-sm font-medium"
        >
          📲 Enviar por WhatsApp
        </a>
      )}

      {status === 'draft' && (
        <button
          onClick={handleMarkSent}
          disabled={loading || emitting}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          Marcar como Enviada
        </button>
      )}

      {(status === 'draft' || status === 'sent' || status === 'overdue') && (
        <button
          onClick={handleMarkPaid}
          disabled={loading || emitting}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors text-sm font-medium disabled:opacity-50"
        >
          <CheckCircle className="h-4 w-4" />
          {loading ? 'Salvando...' : 'Marcar como Paga'}
        </button>
      )}
    </div>
  )
}
