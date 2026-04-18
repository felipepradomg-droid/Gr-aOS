import MercadoPagoConfig, { Payment } from "mercadopago";

export const PLANS = {
  starter: {
    id: "starter",
    name: "GrúaOS Starter",
    price: 97,
    description: "50 cotações/mês, 1 usuário",
    cotacoesLimit: 50,
    usuarios: 1,
  },
  pro: {
    id: "pro",
    name: "GrúaOS Pro",
    price: 197,
    description: "Cotações ilimitadas, 3 usuários, WhatsApp",
    cotacoesLimit: 999999,
    usuarios: 3,
  },
  business: {
    id: "business",
    name: "GrúaOS Business",
    price: 397,
    description: "Tudo do Pro + 10 usuários + suporte prioritário",
    cotacoesLimit: 999999,
    usuarios: 10,
  },
};

export async function createPixPayment({
  planId,
  userEmail,
  userName,
  userId,
  accessToken,
}: {
  planId: keyof typeof PLANS;
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
