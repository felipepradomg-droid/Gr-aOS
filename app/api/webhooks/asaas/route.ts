// app/api/webhooks/asaas/route.ts
// Recebe notificações do Asaas e dá baixa automática no banco

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validarWebhookAsaas, AsaasWebhookPayload } from '@/lib/asaas'

export async function POST(req: NextRequest) {
  try {
    // Valida o token do webhook
    const token = req.headers.get('asaas-access-token') || ''
    if (!validarWebhookAsaas(token)) {
      console.warn('[Webhook Asaas] Token inválido')
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const payload: AsaasWebhookPayload = await req.json()
    const { event, payment } = payload

    console.log(`[Webhook Asaas] Evento: ${event} | Payment: ${payment.id}`)

    // Busca o receivable pelo ID externo do Asaas
    const receivable = await prisma.receivable.findUnique({
      where: { externalId: payment.id }
    })

    if (!receivable) {
      // Não encontrou — pode ser de outro sistema, ignora silenciosamente
      return NextResponse.json({ received: true })
    }

    // Processa cada tipo de evento
    switch (event) {
      case 'PAYMENT_RECEIVED':
      case 'PAYMENT_CONFIRMED': {
        // Pagamento confirmado — dá baixa automática
        await prisma.receivable.update({
          where: { id: receivable.id },
          data: {
            status: 'paid',
            paidAmount: payment.netValue,
            paidAt: payment.paymentDate
              ? new Date(payment.paymentDate)
              : new Date(),
            paymentMethodUsed: payment.billingType,
          }
        })

        // Atualiza a fatura vinculada para paga
        if (receivable.invoiceId) {
          await prisma.invoice.update({
            where: { id: receivable.invoiceId },
            data: {
              status: 'paid',
              paidAt: payment.paymentDate
                ? new Date(payment.paymentDate)
                : new Date(),
            }
          })
        }

        // Registra no log de conciliação
        await prisma.reconciliationLog.create({
          data: {
            userId: receivable.userId,
            bankTransactionId: receivable.bankTransactionId || receivable.id,
            receivableId: receivable.id,
            action: 'auto_matched',
            performedBy: null, // null = sistema automático
            confidenceScore: 1.0,
            notes: `Baixa automática via webhook Asaas. Evento: ${event}`,
          }
        })

        console.log(`[Webhook Asaas] Baixa automática: Receivable ${receivable.id}`)
        break
      }

      case 'PAYMENT_OVERDUE': {
        await prisma.receivable.update({
          where: { id: receivable.id },
          data: { status: 'overdue' }
        })
        break
      }

      case 'PAYMENT_DELETED':
      case 'PAYMENT_REFUNDED': {
        await prisma.receivable.update({
          where: { id: receivable.id },
          data: { status: 'cancelled' }
        })

        // Volta a fatura para draft se for estorno
        if (receivable.invoiceId && event === 'PAYMENT_REFUNDED') {
          await prisma.invoice.update({
            where: { id: receivable.invoiceId },
            data: { status: 'draft', paidAt: null }
          })
        }
        break
      }

      default:
        console.log(`[Webhook Asaas] Evento ignorado: ${event}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[Webhook Asaas] Erro:', error)
    // Retorna 200 para o Asaas não ficar reenviando
    return NextResponse.json({ received: true })
  }
}
