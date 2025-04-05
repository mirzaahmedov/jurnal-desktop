import type { MonthValue } from '@/common/features/saldo'

import { ApiStatusCodes } from '@/common/features/crud'
import { SaldoNamespace, useSaldoControllerStore } from '@/common/features/saldo'
import { HttpResponseError } from '@/common/lib/http'

export const handleOstatokResponse = (res: unknown) => {
  if (typeof res === 'object' && res !== null && 'meta' in res && Array.isArray(res.meta)) {
    const meta = ((res?.meta as MonthValue[]) ?? []).map((e) => ({ year: e.year, month: e.month }))
    useSaldoControllerStore.getState().enqueueMonth(SaldoNamespace.JUR_7, ...meta)
  }
}

export const handleOstatokError = (error: Error | null) => {
  if (error instanceof HttpResponseError && error.meta && Array.isArray(error.meta)) {
    const meta = error.meta as MonthValue[]
    useSaldoControllerStore.getState().enqueueMonth(SaldoNamespace.JUR_7, ...meta)
  }
}

export interface OstatokDeleteExistingDocument {
  id: number
  doc_num: string
  doc_date: string
  account_number: string
  main_schet_id: number
  type: 'prixod' | 'internal' | 'rasxod'
}
export const handleOstatokExistingDocumentError = <T>(error: unknown) => {
  if (
    error instanceof HttpResponseError &&
    typeof error.meta === 'object' &&
    error.meta !== null &&
    'code' in error.meta &&
    error.meta?.code === ApiStatusCodes.DOCS_HAVE
  ) {
    const meta =
      (error.meta as {
        code: number
        docs: T[]
        saldo_id: {
          id: number
        }
      }) ?? {}
    if (Array.isArray(meta.docs)) {
      return meta
    }
  }
  return null
}

export interface OstatokDeleteExistingSaldo {
  year: number
  month: number
  main_schet_id: number
  account_number: string
}
export const handleOstatokDeleteExistingSaldoError = (error: unknown) => {
  if (
    error instanceof HttpResponseError &&
    typeof error.meta === 'object' &&
    error.meta !== null &&
    'code' in error.meta &&
    error.meta?.code === ApiStatusCodes.DOCS_HAVE
  ) {
    const meta =
      (error.meta as {
        code: number
        docs: OstatokDeleteExistingSaldo
      }) ?? {}
    if (meta.docs) {
      return meta
    }
  }
  return null
}
