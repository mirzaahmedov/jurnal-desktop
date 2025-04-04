import type { KassaOstatok, ResponseMeta } from '@/common/models'

import { z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { main_schet } from '@/common/features/crud/middleware'
import { withPreprocessor } from '@/common/lib/validation'

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

export const KassaOstatokService = new CRUDService<
  KassaOstatok,
  KassaOstatokFormValues,
  KassaOstatokFormValues,
  KassaOstatokMeta
>({
  endpoint: ApiEndpoints.kassa_saldo
}).use(main_schet())

export const KassaOstatokFormSchema = withPreprocessor(
  z.object({
    summa: z.number(),
    year: z.number(),
    month: z.number(),
    main_schet_id: z.number().optional()
  })
)

export type KassaOstatokFormValues = z.infer<typeof KassaOstatokFormSchema>
