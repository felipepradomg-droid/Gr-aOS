// app/api/stripe/checkout/route.ts
// Cria sessão de checkout do Stripe

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await req.json()
    const { plan } = body

    const priceId = plan === 'pro'
      ? process.env.STRIPE_PRICE_PRO
      : process.env.STRIPE_PRICE_ENTERPRISE

    if (!priceId) {
      return NextResponse.json({ error: 'Plano inválido' }, { status: 400 })
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXTAUTH_URL}/checkout/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/checkout/erro`,
      customer_email: session.user.email ?? undefined,
      metadata: {
        userId: session.user.id,
        plan,
      },
      subscription_data: {
        metadata: {
          userId: session.user.id,
          plan,
        },
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('[POST /api/stripe/checkout]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
