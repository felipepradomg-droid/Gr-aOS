'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function CotacaoPage() {
  const params = useParams()
  const router = useRouter()
  const [cotacao, setCotacao] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/cotacoes/${params.id}`)
      .then(r => r.json())
      .then(data => { setCotacao(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [params.id])

  if (loading) return <div className="p-6">Carregando...</div>
  if (!cotacao) return <div className="p-6">Cotação não encontrada.</div>

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button onClick={() => router.back()} className="text-sm text-gray-500 mb-4">← Voltar</button>
      <h1 className="text-2xl font-bold mb-2">{cotacao.clienteNome}</h1>
      <p className="text-gray-600 mb-4">{cotacao.descricao}</p>
      <div className="bg-white border rounded-xl p-4 space-y-2">
        <p><span className="font-medium">Status:</span> {cotacao.status}</p>
        <p><span className="font-medium">Email:</span> {cotacao.clienteEmail || '—'}</p>
        <p><span className="font-medium">Telefone:</span> {cotacao.clienteTel || '—'}</p>
        {cotacao.valor && <p><span className="font-medium">Valor:</span> R$ {cotacao.valor.toLocaleString('pt-BR')}</p>}
      </div>
    </div>
  )
}
