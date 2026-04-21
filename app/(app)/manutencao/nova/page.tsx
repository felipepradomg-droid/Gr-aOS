'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createMaintenance } from '@/lib/actions/maintenance'
import { getEquipmentForSelect } from '@/lib/actions/equipment'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface EquipmentOption {
  id: string
  name: string
  status: string
}

export default function NovaManutencaoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedEquipment = searchParams.get('equipmentId')

  const [loading, setLoading] = useState(false)
  const [equipment, setEquipment] = useState<EquipmentOption[]>([])

  useEffect(() => {
    getEquipmentForSelect().then(setEquipment)
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const result = await createMaintenance(formData)
    setLoading(false)
    if (result?.error) {
      toast.error(result.error as string)
    } else {
      toast.success('Manutenção registrada!')
      router.push('/manutencao')
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/manutencao">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Registrar Manutenção
          </h1>
          <p className="text-sm text-gray-500">Preventiva, corretiva ou inspeção</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Equipamento *
            </label>
            <select
              name="equipmentId"
              required
              defaultValue={preselectedEquipment ?? ''}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
            >
              <option value="">Selecione o equipamento</option>
              {equipment.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  {eq.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Tipo de Manutenção *
            </label>
            <select
              name="maintenanceType"
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
            >
              <option value="">Selecione</option>
              <option value="preventive">🔧 Preventiva</option>
              <option value="corrective">🚨 Corretiva</option>
              <option value="inspection">🔍 Inspeção</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Descrição *
            </label>
            <textarea
              name="description"
              required
              placeholder="Descreva o serviço de manutenção..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Prestador / Oficina
            </label>
            <input
              name="provider"
              placeholder="Nome da empresa ou técnico"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Data de Entrada *
              </label>
              <input
                name="startDate"
                type="date"
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Previsão de Retorno
              </label>
              <input
                name="endDate"
                type="date"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Custo (R$)
              </label>
              <input
                name="cost"
                type="number"
                step="0.01"
                placeholder="0,00"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Horímetro
              </label>
              <input
                name="hoursAtService"
                type="number"
                step="0.1"
                placeholder="horas"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Observações
            </label>
            <textarea
              name="notes"
              rows={2}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Registrar Manutenção'}
        </button>
      </form>
    </div>
  )
}
