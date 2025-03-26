import type { KassaOstatokPayload } from './utils'
import type { KassaOstatok, ResponseMeta } from '@/common/models'

import { withPreprocessor } from '@renderer/common/lib/validation'
import { z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { main_schet } from '@/common/features/crud/middleware'

interface KassaOstatokMeta extends ResponseMeta {
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

export const kassaOstatokService = new CRUDService<
  KassaOstatok,
  KassaOstatokPayload,
  KassaOstatokPayload,
  KassaOstatokMeta
>({
  endpoint: ApiEndpoints.kassa_saldo
}).use(main_schet())

export const KassaOstatokProvodkaFormSchema = withPreprocessor(
  z.object({
    spravochnik_operatsii_id: z.number(),
    summa: z.number().min(1),
    id_spravochnik_podrazdelenie: z.number().optional(),
    id_spravochnik_sostav: z.number().optional(),
    id_spravochnik_type_operatsii: z.number().optional()
  })
)

export const KassaOstatokFormSchema = withPreprocessor(
  z.object({
    doc_num: z.string(),
    doc_date: z.string(),
    opisanie: z.string().optional(),
    prixod: z.boolean(),
    rasxod: z.boolean(),
    childs: z.array(KassaOstatokProvodkaFormSchema)
  })
)

export type KassaOstatokFormValues = z.infer<typeof KassaOstatokFormSchema>
export type KassaOstatokProvodkaFormValues = z.infer<typeof KassaOstatokProvodkaFormSchema>
