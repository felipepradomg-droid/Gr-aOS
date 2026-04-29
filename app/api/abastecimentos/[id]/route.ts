import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const abastecimento = await prisma.fuelSupply.findFirst({
      where: { id: params.id, userId: session.user.id },
    })
    if (!abastecimento) {
      return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
    }

    await prisma.fuelSupply.delete({ where: { id: params.id } })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[DELETE /api/abastecimentos]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
