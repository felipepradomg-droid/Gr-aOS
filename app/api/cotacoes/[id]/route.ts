// app/api/cotacoes/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getCotacao(id: string, userId: string) {
  return prisma.cotacao.findFirst({ where: { id, userId } });
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const cotacao = await getCotacao(params.id, session.user.id);
  if (!cotacao) return NextResponse.json({ error: "Não encontrada" }, { status: 404 });

  return NextResponse.json(cotacao);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const existing = await getCotacao(params.id, session.user.id);
  if (!existing) return NextResponse.json({ error: "Não encontrada" }, { status: 404 });

  const body = await req.json();
  const allowed = ["clienteNome", "clienteEmail", "clienteTel", "descricao", "valor", "status", "observacoes"];
  const data: any = {};
  for (const key of allowed) {
    if (key in body) data[key] = body[key];
  }

  const updated = await prisma.cotacao.update({ where: { id: params.id }, data });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const existing = await getCotacao(params.id, session.user.id);
  if (!existing) return NextResponse.json({ error: "Não encontrada" }, { status: 404 });

  await prisma.cotacao.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
