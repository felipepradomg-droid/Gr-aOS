// lib/hooks/useAbastecimentos.ts

import { useState, useEffect, useCallback } from 'react'

export interface Abastecimento {
  id: string
  equipmentId: string
  equipment: { name: string; type: string }
  supplyDate: string
  fuelType: string
  liters: number
  pricePerLiter: number
  totalCost: number
  meterType: string
  meterReading: number | null
  supplier: string | null
  invoiceNumber: string | null
  operatorName: string | null
  notes: string | null
}

export interface AbastecimentoFormData {
  equipmentId: string
  supplyDate?: string
  fuelType: string
  liters: number
  pricePerLiter: number
  meterType: string
  meterReading?: number
  supplier?: string
  invoiceNumber?: string
  operatorName?: string
  notes?: string
}

export function useAbastecimentos(equipmentId?: string) {
  const [abastecimentos, setAbastecimentos] = useState<Abastecimento[]>([])
  const [totalLitros, setTotalLitros] = useState(0)
  const [totalCusto, setTotalCusto]   = useState(0)
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState<string | null>(null)

  const fetchAbastecimentos = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = equipmentId ? `?equipmentId=${equipmentId}` : ''
      const res = await fetch(`/api/abastecimentos${params}`)
      if (!res.ok) throw new Error('Erro ao buscar abastecimentos')
      const data = await res.json()
      setAbastecimentos(data.abastecimentos)
      setTotalLitros(data.totalLitros)
      setTotalCusto(data.totalCusto)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [equipmentId])

  useEffect(() => { fetchAbastecimentos() }, [fetchAbastecimentos])

  const criar = async (dados: AbastecimentoFormData) => {
    const res = await fetch('/api/abastecimentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Erro ao salvar')
    }
    await fetchAbastecimentos()
    return res.json()
  }

  const deletar = async (id: string) => {
    const res = await fetch(`/api/abastecimentos/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Erro ao deletar')
    await fetchAbastecimentos()
  }

  return { abastecimentos, totalLitros, totalCusto, loading, error, criar, deletar, refresh: fetchAbastecimentos }
}
