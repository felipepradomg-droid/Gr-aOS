// lib/nfeio.ts
const NFEIO_BASE_URL = 'https://api.nfe.io/v1'

interface NfseData {
  cityServiceCode: string
  description: string
  servicesAmount: number
  borrower: {
    name: string
    email?: string
    federalTaxNumber?: string
    address?: {
      street?: string
      number?: string
      city?: string
      state?: string
      postalCode?: string
    }
  }
}

interface NfseResponse {
  serviceInvoice?: {
    id: string
    number: string
    checkCode: string
    status: string
    pdfUrl?: string
    xmlUrl?: string
  }
  error?: string
}

function authHeader(apiKey: string) {
  return `Basic ${Buffer.from(apiKey + ':').toString('base64')}`
}

export async function emitirNfse(
  companyId: string,
  apiKey: string,
  ambiente: string,
  data: NfseData
): Promise<NfseResponse> {
  try {
    const response = await fetch(
      `${NFEIO_BASE_URL}/companies/${companyId}/serviceinvoices`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader(apiKey),
        },
        body: JSON.stringify({
          cityServiceCode: data.cityServiceCode,
          description: data.description,
          servicesAmount: data.servicesAmount,
          borrower: data.borrower,
          environment: ambiente,
        }),
      }
    )

    const result = await response.json()
    if (!response.ok) return { error: result.message || 'Erro ao emitir NFS-e' }
    return { serviceInvoice: result }
  } catch (error) {
    console.error('[NFEio] emitirNfse:', error)
    return { error: 'Falha na conexão com NFE.io' }
  }
}

export async function consultarNfse(
  companyId: string,
  apiKey: string,
  invoiceId: string
): Promise<NfseResponse> {
  try {
    const response = await fetch(
      `${NFEIO_BASE_URL}/companies/${companyId}/serviceinvoices/${invoiceId}`,
      {
        headers: { 'Authorization': authHeader(apiKey) },
      }
    )

    const result = await response.json()
    if (!response.ok) return { error: result.message || 'Erro ao consultar NFS-e' }
    return { serviceInvoice: result }
  } catch (error) {
    console.error('[NFEio] consultarNfse:', error)
    return { error: 'Falha na conexão com NFE.io' }
  }
}

export async function cancelarNfse(
  companyId: string,
  apiKey: string,
  invoiceId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(
      `${NFEIO_BASE_URL}/companies/${companyId}/serviceinvoices/${invoiceId}`,
      {
        method: 'DELETE',
        headers: { 'Authorization': authHeader(apiKey) },
      }
    )

    if (!response.ok) {
      const result = await response.json()
      return { success: false, error: result.message || 'Erro ao cancelar NFS-e' }
    }
    return { success: true }
  } catch (error) {
    console.error('[NFEio] cancelarNfse:', error)
    return { success: false, error: 'Falha na conexão com NFE.io' }
  }
}
