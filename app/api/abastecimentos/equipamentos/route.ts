import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const equipamentos = await prisma.equipment.findMany({
      where: { userId: session.user.id },
      select: { id: true, name: true, type: true },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(equipamentos)
  } catch (error) {
    console.error('[GET /api/abastecimentos/equipamentos]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
