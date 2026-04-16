// app/api/cron/renovar-planos/route.ts
// Executado automaticamente pela Vercel todo dia à meia-noite
// Configurado em vercel.json

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  // Segurança: só aceita chamada com o secret correto
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const hoje = new Date();

  // Busca usuários com plano pago que expiraram
  const expirados = await prisma.user.findMany({
    where: {
      plan: { not: "free" },
      planExpiresAt: { lt: hoje },
    },
    select: { id: true, email: true, plan: true, planExpiresAt: true },
  });

  if (expirados.length === 0) {
    return NextResponse.json({ ok: true, rebaixados: 0 });
  }

  // Rebaixa para free
  const ids = expirados.map((u) => u.id);
  await prisma.user.updateMany({
    where: { id: { in: ids } },
    data: { plan: "free", planExpiresAt: null },
  });

  console.log(`[CRON] ${expirados.length} usuário(s) rebaixados para free:`, ids);

  // Opcional: enviar email de aviso (integre com Resend/SendGrid)
  // for (const user of expirados) {
  //   await sendExpirationEmail(user.email);
  // }

  return NextResponse.json({ ok: true, rebaixados: expirados.length, ids });
}
