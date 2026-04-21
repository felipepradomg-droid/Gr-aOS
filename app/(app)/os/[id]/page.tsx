import { getServiceOrderById } from '@/lib/actions/service-orders'
import { OSStatusActions } from '@/components/os/os-status-actions'
import { OSWhatsAppButton } from '@/components/os/os-whatsapp-button'
import { CreateInvoiceFromOS } from '@/components/os/create-invoice-from-os'
import { notFound } from 'next/navigation'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ChevronLeft, Calendar, MapPin, Wrench, DollarSign, User, FileText } from 'lucide-react'
import Link from 'next/link'

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pendente', color: 'bg-gray-100 text-gray-700' },
  confirmed: { label: 'Confirmada', color: 'bg-blue-100 text-blue-700' },
  in_progress: { label: 'Em Execução', color: 'bg-green-100 text-green-700' },
  completed: { label: 'Concluída', color: 'bg-purple-100 text-purple-700' },
  cancelled: { label: 'Cancelada', color: 'bg-red-100 text-red-700' },
}

export default async function OSDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const os = await getServiceOrderById(params.id)
  if (!os) notFound()

  const statusConfig = STATUS_CONFIG[os.status] ?? STATUS_CONFIG.pending

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Link href="/os">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors mt-0.5">
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
        </Link>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-bold text-gray-400">{os.osNumber}</p>
              <h1 className="text-xl font-bold text-gray-900 mt-0.5">
                {os.clienteNome}
              </h1>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${statusConfig.color}`}
            >
              {statusConfig.label}
            </span>
          </div>
        </div>
      </div>

      {/* Ações de status */}
      <OSStatusActions osId={os.id} currentStatus={os.status} />

      {/* Fatura vinculada */}
      {os.invoice && (
        <Link href={`/faturas/${os.invoice.id}`}>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-green-700">
              <FileText className="h-4 w-4" />
              <span className="text-sm font-medium">
                Fatura {os.invoice.invoiceNumber}
              </span>
            </div>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                os.invoice.status === 'paid'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              {os.invoice.status === 'paid' ? 'Paga ✅' : 'Ver fatura'}
            </span>
          </div>
        </Link>
      )}

      {/* Cliente */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <User className="h-4 w-4" />
          Cliente
        </h2>
        <p className="font-medium text-gray-900">{os.clienteNome}</p>
        {os.clienteTel && (
          <p className="text-sm text-gray-500 mt-0.5">{os.clienteTel}</p>
        )}
      </div>

      {/* Equipamento */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Wrench className="h-4 w-4" />
          Equipamento
        </h2>
        <p className="font-medium text-gray-900">{os.equipment.name}</p>
        {os.operatorName && (
          <p className="text-sm text-gray-500 mt-1">
            Operador: {os.operatorName}
          </p>
        )}
      </div>

      {/* Período e local */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Período e Local
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              Início
            </p>
            <p className="font-medium text-gray-900 mt-0.5">
              {formatDate(os.startDate as unknown as string)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              Fim
            </p>
            <p className="font-medium text-gray-900 mt-0.5">
              {formatDate(os.endDate as unknown as string)}
            </p>
          </div>
        </div>

        {os.serviceAddress && (
          <div className="mt-3 flex items-start gap-1.5">
            <MapPin className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-gray-700">{os.serviceAddress}</p>
              {os.serviceCity && (
                <p className="text-sm text-gray-500">{os.serviceCity}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Financeiro */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Financeiro
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              Dias
            </p>
            <p className="font-bold text-gray-900 text-lg mt-0.5">
              {os.totalDays ?? '-'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              Diária
            </p>
            <p className="font-bold text-gray-900 text-lg mt-0.5">
              {os.dailyRate ? formatCurrency(os.dailyRate) : '-'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              Total
            </p>
            <p className="font-bold text-green-600 text-lg mt-0.5">
              {os.totalAmount ? formatCurrency(os.totalAmount) : '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Observações */}
      {os.serviceNotes && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-700 mb-2">Observações</h2>
          <p className="text-sm text-gray-600">{os.serviceNotes}</p>
        </div>
      )}

      {/* Cotação origem */}
      {os.cotacao && (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500">
            OS gerada a partir da cotação:{' '}
            <span className="font-medium text-gray-700">
              {os.cotacao.descricao.substring(0, 60)}...
            </span>
          </p>
        </div>
      )}

      {/* Ações */}
      <div className="flex flex-col gap-3">
        <OSWhatsAppButton
          osNumber={os.osNumber}
          clienteNome={os.clienteNome}
          clienteTel={os.clienteTel}
          startDate={os.startDate as unknown as string}
          endDate={os.endDate as unknown as string}
          totalAmount={os.totalAmount}
          serviceAddress={os.serviceAddress}
          serviceCity={os.serviceCity}
          status={os.status}
        />
        {os.status === 'completed' && !os.invoice && (
          <CreateInvoiceFromOS osId={os.id} />
        )}
      </div>
    </div>
  )
}
