// lib/asaas.ts
// Cliente de integração com Asaas para boleto, PIX e conciliação

const ASAAS_ENVIRONMENT = process.env.ASAAS_ENVIRONMENT || 'sandbox'
const ASAAS_API_KEY = process.env.ASAAS_API_KEY!

const ASAAS_BASE_URL =
  ASAAS_ENVIRONMENT === 'sandbox'
    ? 'https://sandbox.asaas.com/api/v3'
    : 'https://api.asaas.com/v3'

const headers = () => ({
  'Content-Type': 'application/json',
  'access_token': ASAAS_API_KEY,
})

// ============================================================
// CLIENTES
// ============================================================

interface AsaasCustomer {
  name: string
  cpfCnpj: string
  email?: string
  phone?: string
}

export async function criarOuBuscarCliente(data: AsaasCustomer) {
  try {
    // Busca cliente existente pelo CPF/CNPJ
    const busca = await fetch(
      `${ASAAS_BASE_URL}/customers?cpfCnpj=${data.cpfCnpj}`,
      { headers: headers() }
    )
    const resultado = await busca.json()

    if (resultado.data?.length > 0) {
      return { customer: resultado.data[0] }
    }

    // Cria novo cliente se não existir
    const criacao = await fetch(`${ASAAS_BASE_URL}/customers`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data),
    })
    const novoCliente = await criacao.json()
    return { customer: novoCliente }
  } catch (error) {
    console.error('[Asaas] Erro ao criar/buscar cliente:', error)
    return { error: 'Falha na conexão com Asaas' }
  }
}

// ============================================================
// COBRANÇAS (BOLETO E PIX)
// ============================================================

interface AsaasCobranca {
  customer: string        // ID do cliente no Asaas
  billingType: 'BOLETO' | 'PIX' | 'CREDIT_CARD'
  value: number
  dueDate: string         // formato: YYYY-MM-DD
  description?: string
  externalReference?: string  // ID da Invoice no GrúaOS
  fine?: {
    value: number         // percentual ex: 2 = 2%
  }
  interest?: {
    value: number         // percentual ao mês ex: 1 = 1%
  }
  discount?: {
    value: number
    dueDateLimitDays: number
  }
}

export async function criarCobranca(data: AsaasCobranca) {
  try {
    const response = await fetch(`${ASAAS_BASE_URL}/payments`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data),
    })
    const result = await response.json()

    if (!response.ok) {
      return { error: result.errors?.[0]?.description || 'Erro ao criar cobrança' }
    }

    return { payment: result }
  } catch (error) {
    console.error('[Asaas] Erro ao criar cobrança:', error)
    return { error: 'Falha na conexão com Asaas' }
  }
}

// Busca o QR Code PIX de uma cobrança
export async function buscarQrCodePix(paymentId: string) {
  try {
    const response = await fetch(
      `${ASAAS_BASE_URL}/payments/${paymentId}/pixQrCode`,
      { headers: headers() }
    )
    const result = await response.json()
    return { qrCode: result }
  } catch (error) {
    console.error('[Asaas] Erro ao buscar QR Code PIX:', error)
    return { error: 'Falha ao buscar QR Code' }
  }
}

// Cancela uma cobrança
export async function cancelarCobranca(paymentId: string) {
  try {
    const response = await fetch(
      `${ASAAS_BASE_URL}/payments/${paymentId}`,
      {
        method: 'DELETE',
        headers: headers(),
      }
    )

    if (!response.ok) {
      return { success: false, error: 'Erro ao cancelar cobrança' }
    }

    return { success: true }
  } catch (error) {
    console.error('[Asaas] Erro ao cancelar cobrança:', error)
    return { success: false, error: 'Falha na conexão com Asaas' }
  }
}

// ============================================================
// EXTRATO BANCÁRIO (para conciliação)
// ============================================================

export async function buscarExtrato(
  startDate: string,  // YYYY-MM-DD
  endDate: string     // YYYY-MM-DD
) {
  try {
    const response = await fetch(
      `${ASAAS_BASE_URL}/financialTransactions?startDate=${startDate}&endDate=${endDate}`,
      { headers: headers() }
    )
    const result = await response.json()
    return { transactions: result.data || [] }
  } catch (error) {
    console.error('[Asaas] Erro ao buscar extrato:', error)
    return { error: 'Falha ao buscar extrato' }
  }
}

// ============================================================
// WEBHOOK — valida se a requisição veio do Asaas
// ============================================================

export function validarWebhookAsaas(token: string): boolean {
  return token === process.env.ASAAS_WEBHOOK_TOKEN
}

// Tipos dos eventos de webhook do Asaas
export type AsaasWebhookEvent =
  | 'PAYMENT_RECEIVED'      // Pagamento confirmado
  | 'PAYMENT_CONFIRMED'     // Boleto compensado
  | 'PAYMENT_OVERDUE'       // Vencido
  | 'PAYMENT_DELETED'       // Cancelado
  | 'PAYMENT_REFUNDED'      // Estornado

export interface AsaasWebhookPayload {
  event: AsaasWebhookEvent
  payment: {
    id: string
    externalReference?: string  // ID da Invoice no GrúaOS
    value: number
    netValue: number
    billingType: string
    status: string
    paymentDate?: string
  }
}
