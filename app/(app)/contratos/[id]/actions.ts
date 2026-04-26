'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function faturarContrato(contratoId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return { error: 'Não autorizado' }

  try {
    await fetch(`${process.env.NEXTAUTH_URL}/api/contratos/${contratoId}/faturar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })

    revalidatePath(`/contratos/${contratoId}`)
    return { success: true }
  } catch {
    return { error: 'Erro ao faturar' }
  }
}
