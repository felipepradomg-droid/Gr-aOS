// app/api/mp/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import MercadoPagoConfig, { Payment } from "mercadopago";
import { prisma } from "@/lib/prisma";

const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("[MP_WEBHOOK] Recebido:", JSON.stringify(body));

    // MP envia notificações de tipos diferentes
    if (body.type !== "payment") {
      return NextResponse.json({ ok: true });
    }

    const paymentId = body.data?.id;
    if (!paymentId) {
      return NextResponse.json({ ok: true });
    }

    // Busca detalhes do pagamento na API do MP
    const paymentClient = new Payment(mp);
    const mpPayment = await paymentClient.get({ id: paymentId });

    const status = mpPayment.status; // approved | pending | rejected
    const userId = mpPayment.metadata?.user_id;
    const planId = mpPayment.metadata?.plan_id;

    if (!userId || !planId) {
      console.error("[MP_WEBHOOK] metadata ausente", mpPayment.metadata);
      return NextResponse.json({ ok: true });
    }

    // Atualiza registro de pagamento
    await prisma.payment.updateMany({
      where: { mpPaymentId: String(paymentId) },
      data: { status },
    });

    if (status === "approved") {
      // Ativa o plano do usuário por 30 dias
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      await prisma.user.update({
        where: { id: userId },
        data: {
          plan: planId,
          planExpiresAt: expiresAt,
        },
      });

      console.log(`[MP_WEBHOOK] ✅ Plano ${planId} ativado para user ${userId}`);
    }

    if (status === "rejected" || status === "cancelled") {
      console.log(`[MP_WEBHOOK] ❌ Pagamento ${status} para user ${userId}`);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[MP_WEBHOOK] Erro:", error);
    // Sempre retorna 200 para o MP não retentar indefinidamente
    return NextResponse.json({ ok: true });
  }
}
