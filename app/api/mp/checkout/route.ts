import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createCheckoutPro, PLANS } from "@/lib/mercadopago";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const token = process.env.MERCADOPAGO_TOKEN!;
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

    const preference = await createCheckoutPro({
      planId: planId as keyof typeof PLANS,
      userEmail: user.email!,
      userId: user.id,
      accessToken: token,
    });

    return NextResponse.json({
      checkoutUrl: preference.init_point,
      preferenceId: preference.id,
    });
  } catch (error) {
    console.error("[MP_CHECKOUT]", error);
    return NextResponse.json({ error: "Erro ao criar checkout" }, { status: 500 });
  }
}
