import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const config = await prisma.companyFiscalConfig.findUnique({
    where: { userId: session.user.id },
    include: { municipalityConfig: true },
  });

  return NextResponse.json(config);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const {
    ibgeCode,
    nfeApiKey,
    nfeCompanyId,
    razaoSocial,
    cnpj,
    inscricaoMunicipal,
    codigoServico,
    aliquotaIss,
    ambiente,
    ativo,
  } = body;

  if (!ibgeCode || !nfeApiKey || !nfeCompanyId) {
    return NextResponse.json(
      { error: "Código IBGE, API Key e Company ID são obrigatórios" },
      { status: 400 }
    );
  }

  // Busca o município pelo código IBGE
  const municipalityConfig = await prisma.municipalityTaxConfig.findUnique({
    where: { ibgeCode },
  });

  if (!municipalityConfig) {
    return NextResponse.json(
      { error: "Município não encontrado. Verifique o código IBGE." },
      { status: 404 }
    );
  }

  const config = await prisma.companyFiscalConfig.upsert({
    where: { userId: session.user.id },
    update: {
      municipalityConfigId: municipalityConfig.id,
      nfeApiKey,
      nfeCompanyId,
      razaoSocial,
      cnpj,
      inscricaoMunicipal,
      codigoServico,
      aliquotaIss: aliquotaIss ? parseFloat(aliquotaIss) : null,
      ambiente,
      ativo,
    },
    create: {
      userId: session.user.id,
      municipalityConfigId: municipalityConfig.id,
      nfeApiKey,
      nfeCompanyId,
      razaoSocial,
      cnpj,
      inscricaoMunicipal,
      codigoServico,
      aliquotaIss: aliquotaIss ? parseFloat(aliquotaIss) : null,
      ambiente: ambiente ?? "homologacao",
      ativo: ativo ?? true,
    },
  });

  return NextResponse.json(config);
}
