import MercadoPagoConfig, { Payment } from "mercadopago";

export const PLANS = {
  pro: {
    id: "pro",
    name: "GrúaOS Pro", 
    price: 97,
    description: "Cotações ilimitadas",
  },
  enterprise: {
    id: "enterprise",
    name: "GrúaOS Enterprise",
    price: 247,
    description: "Tudo do Pro + suporte",
  },
};

export async function createPixPayment({
  planId,
  userEmail,
  userName,
  userId,
  accessToken,
}: {
  planId: "pro" | "enterprise";
  userEmail: string;
  userName: string;
  userId: string;
  accessToken: string;
}) {
  const plan = PLANS[planId];
  const mp = new MercadoPagoConfig({ accessToken });
  const payment = new Payment(mp);

  return await payment.create({
    body: {
      transaction_amount: plan.price,
      description: plan.name,
      payment_method_id: "pix",
      payer: {
        email: userEmail,
        first_name: userName.split(" ")[0],
        last_name: userName.split(" ").slice(1).join(" ") || ".",
      },
      metadata: { user_id: userId, plan_id: planId },
      notification_url: `${process.env.NEXTAUTH_URL}/api/mp/webhook`,
      date_of_expiration: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    },
  });
}
