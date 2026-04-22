// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nome, email e senha são obrigatórios." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "A senha deve ter pelo menos 6 caracteres." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Este email já está cadastrado." },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 12);

    // Trial de 7 dias a partir do cadastro
    const trialEndsAt = new Date()
    trialEndsAt.setDate(trialEndsAt.getDate() + 7)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        plan: "free",
        trialEndsAt,
      },
    });

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
  } catch (error) {
    console.error("[REGISTER]", error);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
