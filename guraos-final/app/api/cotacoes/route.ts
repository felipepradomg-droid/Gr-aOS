// app/api/cotacoes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET — listar cotações do usuário
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status");

  const cotacoes = await prisma.cotacao.findMany({
    where: {
      userId: session.user.id,
      ...(status ? { status } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(cotacoes);
}

// POST — criar nova cotação
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const isPro = session.user.plan !== "free";

  // Verificar limite free (10/mês)
  if (!isPro) {
    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);

    const count = await prisma.cotacao.count({
      where: { userId: session.user.id, createdAt: { gte: inicioMes } },
    });

    if (count >= 10) {
      return NextResponse.json(
        { error: "Limite de 10 cotações por mês atingido. Faça upgrade para o plano Pro." },
        { status: 403 }
      );
    }
  }

  const body = await req.json();
  const { clienteNome, clienteEmail, clienteTel, descricao, valor, observacoes } = body;

  if (!clienteNome || !descricao) {
    return NextResponse.json({ error: "Nome do cliente e descrição são obrigatórios." }, { status: 400 });
  }

  const cotacao = await prisma.cotacao.create({
    data: {
      userId: session.user.id,
      clienteNome,
      clienteEmail: clienteEmail || null,
      clienteTel: clienteTel || null,
      descricao,
      valor: valor ?? null,
      observacoes: observacoes || null,
      status: "rascunho",
    },
  });

  return NextResponse.json(cotacao, { status: 201 });
}
