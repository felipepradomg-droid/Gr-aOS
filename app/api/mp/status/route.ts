// app/api/mp/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const paymentId = req.nextUrl.searchParams.get("paymentId");
  if (!paymentId) {
    return NextResponse.json({ error: "paymentId obrigatório" }, { status: 400 });
  }

  const payment = await prisma.payment.findFirst({
    where: {
      mpPaymentId: paymentId,
      userId: session.user.id,
    },
  });

  if (!payment) {
    return NextResponse.json({ error: "Pagamento não encontrado" }, { status: 404 });
  }

  return NextResponse.json({ status: payment.status });
}
