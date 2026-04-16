// lib/mercadopago.ts
import MercadoPagoConfig, { Payment, Preference } from "mercadopago";

export const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export const PLANS = {
  pro: {
    id: "pro",
    name: "GrúaOS Pro",
    price: 97,
    description: "Cotações ilimitadas, 3 usuários, envio WhatsApp",
  },
  enterprise: {
    id: "enterprise",
    name: "GrúaOS Enterprise",
    price: 247,
    description: "Tudo do Pro + usuários ilimitados + suporte prioritário",
  },
};

// Gera cobrança PIX (pagamento único ou primeiro mês)
export async function createPixPayment({
  planId,
  userEmail,
  userName,
  userId,
}: {
  planId: "pro" | "enterprise";
  userEmail: string;
  userName: string;
  userId: string;
}) {
  const plan = PLANS[planId];
  const payment = new Payment(mp);

  const result = await payment.create({
    body: {
      transaction_amount: plan.price,
      description: plan.name,
      payment_method_id: "pix",
      payer: {
        email: userEmail,
        first_name: userName.split(" ")[0],
        last_name: userName.split(" ").slice(1).join(" ") || ".",
      },
      metadata: {
        user_id: userId,
        plan_id: planId,
      },
      notification_url: `${process.env.NEXTAUTH_URL}/api/mp/webhook`,
      date_of_expiration: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30min
    },
  });

  return result;
}
