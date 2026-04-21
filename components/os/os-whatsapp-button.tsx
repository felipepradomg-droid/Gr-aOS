'use client'

import { MessageCircle } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface Props {
  osNumber: string
  clienteNome: string
  clienteTel?: string | null
  startDate: Date | string
  endDate: Date | string
  totalAmount?: number | null
  serviceAddress?: string | null
  serviceCity?: string | null
  status: string
}

export function OSWhatsAppButton({
  osNumber,
  clienteNome,
  clienteTel,
  startDate,
  endDate,
  totalAmount,
  serviceAddress,
  serviceCity,
  status,
}: Props) {
  if (!clienteTel) return null

  function openWhatsApp() {
    const phone = clienteTel!.replace(/\D/g, '')
    const statusLabel =
      status === 'confirmed' ? '✅ Confirmada'
      : status === 'in_progress' ? '🔄 Em Execução'
      : status === 'completed' ? '✔ Concluída'
      : 'Pendente'

    const msg = encodeURIComponent(
      `*Ordem de Serviço ${osNumber}*\n\n` +
      `Olá ${clienteNome}! Segue o resumo da sua OS:\n\n` +
      `📅 Período: ${formatDate(startDate as string)} a ${formatDate(endDate as string)}\n` +
      (totalAmount ? `💰 Total: ${formatCurrency(totalAmount)}\n` : '') +
      (serviceAddress ? `📍 Local: ${serviceAddress}${serviceCity ? `, ${serviceCity}` : ''}\n` : '') +
      `\nStatus: ${statusLabel}\n\n` +
      `Qualquer dúvida, estamos à disposição!`
    )
    window.open(`https://wa.me/55${phone}?text=${msg}`, '_blank')
  }

  return (
    <button
      onClick={openWhatsApp}
      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg border border-green-200 text-green-700 hover:bg-green-50 transition-colors text-sm font-medium"
    >
      <MessageCircle className="h-4 w-4" />
      Enviar OS pelo WhatsApp
    </button>
  )
}
