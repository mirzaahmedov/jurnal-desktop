import type { BankOstatokPayload } from './utils'
import type { BankOstatok, ResponseMeta } from '@/common/models'

import { z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { main_schet } from '@/common/features/crud/middleware'
import { withPreprocessor } from '@/common/lib/validation'

interface BankOstatokMeta extends ResponseMeta {
  internal_prixod_summa: number
  internal_rasxod_summa: number
  internal_summa: number
  page_prixod_summa: number
  page_rasxod_summa: number
  page_summa: number
  from_summa: number
  to_summa: number
  from_summa_prixod: number
  from_summa_rasxod: number
  to_summa_prixod: number
  to_summa_rasxod: number
}

export const bankOstatokService = new CRUDService<
  BankOstatok,
  BankOstatokPayload,
  BankOstatokPayload,
  BankOstatokMeta
>({
  endpoint: ApiEndpoints.bank_saldo
}).use(main_schet())

export const BankOstatokProvodkaFormSchema = withPreprocessor(
  z.object({
    spravochnik_operatsii_id: z.number(),
    summa: z.number().min(1),
    id_spravochnik_podrazdelenie: z.number().optional(),
    id_spravochnik_sostav: z.number().optional(),
    id_spravochnik_type_operatsii: z.number().optional()
  })
)

export const BankOstatokFormSchema = withPreprocessor(
  z.object({
    doc_num: z.string(),
    doc_date: z.string(),
    opisanie: z.string().optional(),
    prixod: z.boolean(),
    rasxod: z.boolean(),
    childs: z.array(BankOstatokProvodkaFormSchema)
  })
)

export type BankOstatokFormValues = z.infer<typeof BankOstatokFormSchema>
export type BankOstatokProvodkaFormValues = z.infer<typeof BankOstatokProvodkaFormSchema>
