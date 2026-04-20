import MercadoPagoConfig, { Preference } from "mercadopago";

export const PLANS = {
  starter: {
    id: "starter",
    name: "GrúaOS Starter",
    price: 97,
    description: "50 cotações/mês, 1 usuário",
  },
  pro: {
    id: "pro",
    name: "GrúaOS Pro",
    price: 197,
    description: "Cotações ilimitadas, 3 usuários, WhatsApp",
  },
  business: {
    id: "business",
    name: "GrúaOS Business",
    price: 397,
    description: "Tudo do Pro + 10 usuários + suporte prioritário",
  },
};

export async function createCheckoutPro({
  planId,
  userEmail,
  userId,
  accessToken,
}: {
  planId: keyof typeof PLANS;
  userEmail: string;
  userId: string;
  accessToken: string;
}) {
  const plan = PLANS[planId];
  const mp = new MercadoPagoConfig({ accessToken });
  const preference = new Preference(mp);

  const result = await preference.create({
    body: {
      items: [
        {
          id: planId,
          title: plan.name,
          description: plan.description,
          quantity: 1,
          unit_price: plan.price,
          currency_id: "BRL",
        },
      ],
      payer: {
        email: userEmail,
      },
      metadata: {
        user_id: userId,
        plan_id: planId,
      },
      back_urls: {
        success: "https://gruaos.vercel.app/checkout/sucesso",
        failure: "https://gruaos.vercel.app/checkout/erro",
        pending: "https://gruaos.vercel.app/checkout/pendente",
      },
      auto_return: "approved",
      notification_url: "https://gruaos.vercel.app/api/mp/webhook",
      payment_methods: {
        excluded_payment_types: [],
        installments: 12,
      },
    },
  });

  return result;
}
