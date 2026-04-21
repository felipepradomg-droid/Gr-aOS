import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value)
}

export function formatDate(date: string | Date) {
  if (!date) return '-'
  const d = typeof date === 'string' ? new Date(date + 'T00:00:00') : date
  return d.toLocaleDateString('pt-BR')
}

export function formatDateTime(date: string | Date) {
  if (!date) return '-'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getDaysBetween(start: string | Date, end: string | Date) {
  const s = typeof start === 'string' ? new Date(start) : start
  const e = typeof end === 'string' ? new Date(end) : end
  return Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1
}

export function isOverdue(date: string | Date) {
  const d = typeof date === 'string' ? new Date(date) : date
  return d < new Date()
}

export function generateOsNumber(count: number) {
  const year = new Date().getFullYear()
  return `OS-${year}-${String(count).padStart(4, '0')}`
}

export function generateInvoiceNumber(count: number) {
  const year = new Date().getFullYear()
  return `FAT-${year}-${String(count).padStart(4, '0')}`
}
