import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',

})

export async function GET() {
  try {
    const subscriptions = await stripe.subscriptions.list({
      status: 'trialing',
      limit: 100,
      expand: ['data.customer', 'data.default_payment_method'],
    })

    const trials = subscriptions.data.map((sub) => {
      const customer = sub.customer as Stripe.Customer
      const paymentMethod = sub.default_payment_method as Stripe.PaymentMethod | null

      const trialEnd = sub.trial_end ? new Date(sub.trial_end * 1000) : null
      const now = new Date()
      const daysLeft = trialEnd
        ? Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        : null

      return {
        id: sub.id,
        customerName: customer?.name || 'Sem nome',
        customerEmail: customer?.email || '',
        hasCard: !!paymentMethod && paymentMethod.type === 'card',
        cardBrand: paymentMethod?.card?.brand || null,
        cardLast4: paymentMethod?.card?.last4 || null,
        trialEnd: trialEnd?.toISOString() || null,
        daysLeft,
      }
    })

    return NextResponse.json({ trials })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
