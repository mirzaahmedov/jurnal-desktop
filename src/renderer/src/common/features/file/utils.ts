import { HttpResponseError } from '@/common/lib/http'

import { ApiStatusCodes } from '../crud'

export interface ImportValidationErrorRow {
  responsible_id: number
  index: number
  name: string
  group_jur7_id: number
  edin: string
  month: number
  year: number
  kol: number
  summa: number
  eski_iznos_summa: number
  doc_num: string
  doc_date: string
}

export const handleImportValidationError = (error: unknown) => {
  if (
    error instanceof HttpResponseError &&
    typeof error.meta === 'object' &&
    error.meta !== null &&
    'code' in error.meta &&
    error.meta?.code === ApiStatusCodes.EXCEL_IMPORT_INVALID
  ) {
    const meta =
      (error.meta as {
        code: number
        doc: ImportValidationErrorRow
      }) ?? {}

    return meta.doc
  }
  return undefined
}
