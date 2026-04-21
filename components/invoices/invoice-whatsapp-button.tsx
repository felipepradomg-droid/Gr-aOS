'use client'

import { MessageCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface Props {
  invoiceNumber: string
  clienteNome: string
  clienteTel?: string | null
  totalAmount: number
  dueDate: Date | string
  status: string
  paymentMethod?: string | null
}

export function InvoiceWhatsAppButton({
  invoiceNumber,
  clienteNome,
  clienteTel,
  totalAmount,
  dueDate,
  status,
  paymentMethod,
}: Props) {
  if (!clienteTel) return null

  function openWhatsApp() {
    const phone = clienteTel!.replace(/\D/g, '')
    const pixInfo =
      paymentMethod === 'pix'
        ? `\n💳 *Pagamento via Pix* — chave enviada em seguida.`
        : ''

    const msg = encodeURIComponent(
      `*Fatura ${invoiceNumber}*\n\n` +
      `Olá ${clienteNome}! 👋\n\n` +
      `Segue o resumo da sua fatura:\n\n` +
      `💰 Valor: *${formatCurrency(totalAmount)}*\n` +
      `📅 Vencimento: ${new Date(dueDate).toLocaleDateString('pt-BR')}\n` +
      `📋 Status: ${status === 'sent' ? 'Aguardando pagamento' : 'Paga ✅'}` +
      pixInfo +
      `\n\nQualquer dúvida, é só chamar!`
    )
    window.open(`https://wa.me/55${phone}?text=${msg}`, '_blank')
  }

  return (
    <button
      onClick={openWhatsApp}
      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg border border-green-200 text-green-700 hover:bg-green-50 transition-colors text-sm font-medium"
    >
      <MessageCircle className="h-4 w-4" />
      Enviar Fatura pelo WhatsApp
    </button>
  )
}
