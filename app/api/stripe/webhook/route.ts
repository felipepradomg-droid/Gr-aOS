// app/api/stripe/webhook/route.ts
// Recebe eventos do Stripe e atualiza o plano do usuário

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',

})

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('[Webhook Stripe] Assinatura inválida:', error)
    return NextResponse.json({ error: 'Assinatura inválida' }, { status: 400 })
  }

  console.log(`[Webhook Stripe] Evento: ${event.type}`)

  switch (event.type) {
    // Checkout concluído — ativa o plano
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.userId
      const plan = session.metadata?.plan

      if (!userId || !plan) break

      const expiresAt = new Date()
      expiresAt.setMonth(expiresAt.getMonth() + 1)

      await prisma.user.update({
        where: { id: userId },
        data: {
          plan,
          planExpiresAt: expiresAt,
        },
      })

      console.log(`[Webhook Stripe] Plano ${plan} ativado para usuário ${userId}`)
      break
    }

    // Assinatura renovada — renova o plano
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice
      const subscriptionId = invoice.subscription as string

      if (!subscriptionId) break

      const subscription = await stripe.subscriptions.retrieve(subscriptionId)
      const userId = subscription.metadata?.userId
      const plan = subscription.metadata?.plan

      if (!userId || !plan) break

      const expiresAt = new Date()
      expiresAt.setMonth(expiresAt.getMonth() + 1)

      await prisma.user.update({
        where: { id: userId },
        data: {
          plan,
          planExpiresAt: expiresAt,
        },
      })

      console.log(`[Webhook Stripe] Renovação do plano ${plan} para usuário ${userId}`)
      break
    }

    // Pagamento falhou — volta para free
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const subscriptionId = invoice.subscription as string

      if (!subscriptionId) break

      const subscription = await stripe.subscriptions.retrieve(subscriptionId)
      const userId = subscription.metadata?.userId

      if (!userId) break

      await prisma.user.update({
        where: { id: userId },
        data: { plan: 'free' },
      })

      console.log(`[Webhook Stripe] Pagamento falhou para usuário ${userId}`)
      break
    }

    // Assinatura cancelada — volta para free
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const userId = subscription.metadata?.userId

      if (!userId) break

      await prisma.user.update({
        where: { id: userId },
        data: {
          plan: 'free',
          planExpiresAt: null,
        },
      })

      console.log(`[Webhook Stripe] Assinatura cancelada para usuário ${userId}`)
      break
    }

    default:
      console.log(`[Webhook Stripe] Evento ignorado: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
