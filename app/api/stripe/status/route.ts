// app/api/stripe/status/route.ts
// Verifica o status de uma sessão de checkout

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',

})

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json({ error: 'session_id obrigatório' }, { status: 400 })
    }

    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId)

    if (checkoutSession.payment_status === 'paid') {
      const plan = checkoutSession.metadata?.plan
      const userId = checkoutSession.metadata?.userId

      if (plan && userId) {
        const expiresAt = new Date()
        expiresAt.setMonth(expiresAt.getMonth() + 1)

        await prisma.user.update({
          where: { id: userId },
          data: { plan, planExpiresAt: expiresAt },
        })
      }
    }

    return NextResponse.json({
      status: checkoutSession.payment_status,
      plan: checkoutSession.metadata?.plan,
    })
  } catch (error) {
    console.error('[GET /api/stripe/status]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
