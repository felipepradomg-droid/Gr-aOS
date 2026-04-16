// app/api/mp/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createPixPayment, PLANS } from "@/lib/mercadopago";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { planId } = await req.json();
    if (!PLANS[planId as keyof typeof PLANS]) {
      return NextResponse.json({ error: "Plano inválido" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    const payment = await createPixPayment({
      planId: planId as "pro" | "enterprise",
      userEmail: user.email!,
      userName: user.name || "Cliente",
      userId: user.id,
    });

    // Salva pagamento pendente no banco
    await prisma.payment.create({
      data: {
        userId: user.id,
        mpPaymentId: String(payment.id),
        planId,
        amount: PLANS[planId as keyof typeof PLANS].price,
        status: "pending",
      },
    });

    return NextResponse.json({
      paymentId: payment.id,
      pixQrCode: payment.point_of_interaction?.transaction_data?.qr_code,
      pixQrCodeBase64: payment.point_of_interaction?.transaction_data?.qr_code_base64,
      pixCopyPaste: payment.point_of_interaction?.transaction_data?.qr_code,
      expiresAt: payment.date_of_expiration,
      amount: PLANS[planId as keyof typeof PLANS].price,
      planName: PLANS[planId as keyof typeof PLANS].name,
    });
  } catch (error) {
    console.error("[MP_CHECKOUT]", error);
    return NextResponse.json({ error: "Erro ao gerar PIX" }, { status: 500 });
  }
}
