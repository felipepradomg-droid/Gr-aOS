'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Search, HardHat, Phone, CreditCard, ChevronRight } from 'lucide-react'

interface Operator {
  id: string
  nome: string
  cpf?: string | null
  telefone?: string | null
  cnhCategoria?: string | null
  paymentType: string
  salarioFixo?: number | null
  valorDiaria?: number | null
  valorHora?: number | null
  status: string
  cidade?: string | null
  estado?: string | null
  _count?: {
    operatorAssignments: number
    workLogs: number
  }
}

const paymentLabel: Record<string, string> = {
  fixed: 'Salário Fixo',
  daily: 'Por Diária',
  hourly: 'Por Hora',
}

const paymentValue = (op: Operator) => {
  if (op.paymentType === 'fixed' && op.salarioFixo)
    return op.salarioFixo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) + '/mês'
  if (op.paymentType === 'daily' && op.valorDiaria)
    return op.valorDiaria.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) + '/dia'
  if (op.paymentType === 'hourly' && op.valorHora)
    return op.valorHora.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) + '/h'
  return '—'
}

export default function OperadoresPage() {
  const [operadores, setOperadores] = useState<Operator[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filtroStatus, setFiltroStatus] = useState<'all' | 'active' | 'inactive'>('all')

  useEffect(() => {
    fetch('/api/operadores')
      .then(r => r.json())
      .then(data => setOperadores(Array.isArray(data) ? data : []))
      .catch(() => setOperadores([]))
      .finally(() => setLoading(false))
  }, [])

  const filtrados = operadores.filter(op => {
    const matchSearch =
      op.nome.toLowerCase().includes(search.toLowerCase()) ||
      op.cidade?.toLowerCase().includes(search.toLowerCase()) ||
      op.cpf?.includes(search)
    const matchStatus = filtroStatus === 'all' || op.status === filtroStatus
    return matchSearch && matchStatus
  })

  const ativos = operadores.filter(o => o.status === 'active').length
  const inativos = operadores.filter(o => o.status === 'inactive').length

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-2xl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Operadores</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {ativos} ativo{ativos !== 1 ? 's' : ''} · {inativos} inativo{inativos !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/operadores/novo">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-700 transition-colors">
            <Plus className="h-4 w-4" />
            Novo
          </button>
        </Link>
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nome, CPF ou cidade..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-gray-400 bg-white"
        />
      </div>

      {/* Filtro status */}
      <div className="flex gap-2">
        {[
          { value: 'all', label: 'Todos' },
          { value: 'active', label: '✅ Ativos' },
          { value: 'inactive', label: '⛔ Inativos' },
        ].map(f => (
          <button
            key={f.value}
            onClick={() => setFiltroStatus(f.value as typeof filtroStatus)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              filtroStatus === f.value
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Lista */}
      {loading ? (
        <div className="text-center py-12 text-gray-400 text-sm">Carregando...</div>
      ) : filtrados.length === 0 ? (
        <div className="text-center py-12 space-y-2">
          <HardHat className="h-10 w-10 text-gray-300 mx-auto" />
          <p className="text-gray-500 text-sm font-medium">Nenhum operador encontrado</p>
          <Link href="/operadores/novo">
            <button className="mt-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold">
              Cadastrar primeiro operador
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtrados.map(op => (
            <Link key={op.id} href={`/operadores/${op.id}`}>
              <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-400 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Avatar inicial */}
                    <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {op.nome.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900 truncate">{op.nome}</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                          op.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {op.status === 'active' ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        {op.telefone && (
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Phone className="h-3 w-3" />
                            {op.telefone}
                          </span>
                        )}
                        {op.cpf && (
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <CreditCard className="h-3 w-3" />
                            {op.cpf}
                          </span>
                        )}
                        {op.cnhCategoria && (
                          <span className="text-xs text-gray-500">
                            🪪 CNH {op.cnhCategoria}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-gray-400">{paymentLabel[op.paymentType]}</p>
                      <p className="text-sm font-semibold text-gray-900">{paymentValue(op)}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>

                {/* Rodapé do card — vínculos */}
                {(op._count?.operatorAssignments ?? 0) > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100 flex gap-3">
                    <span className="text-xs text-gray-500">
                      📋 {op._count?.operatorAssignments} vínculo{(op._count?.operatorAssignments ?? 0) !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
