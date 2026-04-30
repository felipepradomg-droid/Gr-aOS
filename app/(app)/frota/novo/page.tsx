'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createEquipment } from '@/lib/actions/equipment'
import { ChevronLeft, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface Spec {
  key: string
  value: string
  unit: string
}

export default function NovoEquipamentoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [specs, setSpecs] = useState<Spec[]>([])

  const addSpec = () => setSpecs([...specs, { key: '', value: '', unit: '' }])
  const removeSpec = (i: number) => setSpecs(specs.filter((_, idx) => idx !== i))
  const updateSpec = (i: number, field: keyof Spec, val: string) => {
    const updated = [...specs]
    updated[i][field] = val
    setSpecs(updated)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    formData.set('specs', JSON.stringify(specs.filter((s) => s.key && s.value)))
    const result = await createEquipment(formData)
    setLoading(false)
    if (result?.error) {
      toast.error(result.error as string)
    } else {
      toast.success('Equipamento cadastrado!')
      router.push('/frota')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6" style={{ paddingBottom: '120px' }}>
      <div className="flex items-center gap-3">
        <Link href="/frota">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Novo Equipamento</h1>
          <p className="text-sm text-gray-500">Preencha os dados do equipamento</p>
        </div>
      </div>

      <form id="equipment-form" onSubmit={handleSubmit} className="space-y-5 mt-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-700">Dados Básicos</h2>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Nome do Equipamento *</label>
            <input
              name="name"
              required
              placeholder="ex: Guindaste Grove RT550E"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Tipo *</label>
              <select
                name="type"
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
              >
                <option value="">Selecione</option>
                <option value="crane">🏗️ Guindaste</option>
                <option value="forklift">🦺 Empilhadeira</option>
                <option value="truck">🚛 Caminhão</option>
                <option value="platform">🔧 Plataforma</option>
                <option value="other">📦 Outro</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Capacidade (ton)</label>
              <input
                name="capacityTons"
                type="number"
                step="0.1"
                placeholder="ex: 50"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Marca</label>
              <input
                name="brand"
                placeholder="ex: Grove, Liebherr"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Modelo</label>
              <input
                name="model"
                placeholder="ex: RT550E"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Ano</label>
              <input
                name="year"
                type="number"
                placeholder="ex: 2020"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Placa</label>
              <input
                name="plate"
                placeholder="ex: ABC-1234"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Número de Série</label>
            <input
              name="serialNumber"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-700">Valores de Locação</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Diária (R$)</label>
              <input
                name="dailyRate"
                type="number"
                step="0.01"
                placeholder="0,00"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Hora Extra (R$)</label>
              <input
                name="hourlyRate"
                type="number"
                step="0.01"
                placeholder="0,00"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-700">Especificações Técnicas</h2>
            <button
              type="button"
              onClick={addSpec}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Adicionar
            </button>
          </div>

          {specs.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-3">
              Nenhuma especificação. Clique em "Adicionar" para incluir.
            </p>
          ) : (
            specs.map((spec, i) => (
              <div key={i} className="flex gap-2 items-start">
                <div className="flex-1 grid grid-cols-3 gap-2">
                  <input
                    placeholder="Parâmetro"
                    value={spec.key}
                    onChange={(e) => updateSpec(i, 'key', e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                  <input
                    placeholder="Valor"
                    value={spec.value}
                    onChange={(e) => updateSpec(i, 'value', e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                  <input
                    placeholder="Unidade"
                    value={spec.unit}
                    onChange={(e) => updateSpec(i, 'unit', e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeSpec(i)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-2">
          <h2 className="font-semibold text-gray-700">Observações</h2>
          <textarea
            name="notes"
            placeholder="Informações adicionais..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
          />
        </div>
      </form>

      {/* Botão fixo no rodapé — sempre visível acima da bottom nav */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          background: 'var(--bg, #0A0A0A)',
          borderTop: '1px solid var(--border, #2A2A2A)',
          padding: '12px 16px 80px',
        }}
      >
        <button
          type="submit"
          form="equipment-form"
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            background: '#111827',
            color: '#fff',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '1rem',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.5 : 1,
          }}
        >
          {loading ? 'Salvando...' : 'Cadastrar Equipamento'}
        </button>
      </div>
    </div>
  )
}
