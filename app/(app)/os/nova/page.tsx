'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createServiceOrder } from '@/lib/actions/service-orders'
import { getEquipmentForSelect } from '@/lib/actions/equipment'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface EquipmentOption {
  id: string
  name: string
  status: string
  dailyRate?: number | null
}

export default function NovaOSPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedEquipment = searchParams.get('equipmentId')

  const [loading, setLoading] = useState(false)
  const [equipment, setEquipment] = useState<EquipmentOption[]>([])
  const [selectedDailyRate, setSelectedDailyRate] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [totalDays, setTotalDays] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)

  useEffect(() => {
    getEquipmentForSelect().then(setEquipment)
  }, [])

  useEffect(() => {
    if (startDate && endDate && selectedDailyRate) {
      const s = new Date(startDate)
      const e = new Date(endDate)
      if (e >= s) {
        const days =
          Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1
        setTotalDays(days)
        setTotalAmount(days * parseFloat(selectedDailyRate))
      }
    }
  }, [startDate, endDate, selectedDailyRate])

  function handleEquipmentChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selected = equipment.find((eq) => eq.id === e.target.value)
    if (selected?.dailyRate) {
      setSelectedDailyRate(String(selected.dailyRate))
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const result = await createServiceOrder(formData)
    setLoading(false)
    if (result?.error) {
      toast.error(result.error as string)
    } else {
      toast.success('OS criada com sucesso!')
      router.push('/os')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/os">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Nova OS</h1>
          <p className="text-sm text-gray-500">Ordem de Serviço manual</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Cliente */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-700">Cliente</h2>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Nome do Cliente *
            </label>
            <input
              name="clienteNome"
              required
              placeholder="ex: Construtora ABC"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Telefone / WhatsApp
            </label>
            <input
              name="clienteTel"
              placeholder="ex: 11999999999"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
        </div>

        {/* Equipamento */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-700">Equipamento</h2>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Equipamento *
            </label>
            <select
              name="equipmentId"
              required
              defaultValue={preselectedEquipment ?? ''}
              onChange={handleEquipmentChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
            >
              <option value="">Selecione o equipamento</option>
              {equipment.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  {eq.name}{' '}
                  {eq.status !== 'available' ? `(${eq.status})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Operador
            </label>
            <input
              name="operatorName"
              placeholder="Nome do operador"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
        </div>

        {/* Período */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-700">Período e Local</h2>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Data Início *
              </label>
              <input
                name="startDate"
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Data Fim *
              </label>
              <input
                name="endDate"
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Endereço da Obra
            </label>
            <input
              name="serviceAddress"
              placeholder="Rua, número, bairro"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Cidade</label>
            <input
              name="serviceCity"
              placeholder="ex: São Paulo - SP"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
        </div>

        {/* Financeiro */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-700">Financeiro</h2>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Diária (R$)
            </label>
            <input
              name="dailyRate"
              type="number"
              step="0.01"
              placeholder="0,00"
              value={selectedDailyRate}
              onChange={(e) => setSelectedDailyRate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          {totalDays > 0 && (
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Dias</span>
                <span className="font-medium">{totalDays}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-500">Total estimado</span>
                <span className="font-bold text-gray-900">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(totalAmount)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Observações */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-2">
          <h2 className="font-semibold text-gray-700">Observações</h2>
          <textarea
            name="serviceNotes"
            placeholder="Informações adicionais sobre o serviço..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Criando OS...' : 'Criar Ordem de Serviço'}
        </button>
      </form>
    </div>
  )
}
