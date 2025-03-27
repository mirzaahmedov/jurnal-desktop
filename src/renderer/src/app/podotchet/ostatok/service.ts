import type { OrganizationOstatokPayload } from './utils'
import type { PodotchetOstatok, ResponseMeta } from '@renderer/common/models'

import { withPreprocessor } from '@renderer/common/lib/validation'
import { z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { main_schet } from '@/common/features/crud/middleware'

interface PodotchetOstatokMeta extends ResponseMeta {
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

export const podotchetOstatokService = new CRUDService<
  PodotchetOstatok,
  OrganizationOstatokPayload,
  OrganizationOstatokPayload,
  PodotchetOstatokMeta
>({
  endpoint: ApiEndpoints.podotchet_saldo
}).use(main_schet())

export const PodotchetOstatokProvodkaFormSchema = withPreprocessor(
  z.object({
    spravochnik_operatsii_id: z.number(),
    summa: z.number().min(1),
    id_spravochnik_podrazdelenie: z.number().optional(),
    id_spravochnik_sostav: z.number().optional(),
    id_spravochnik_type_operatsii: z.number().optional()
  })
)

export const PodotchetOstatokFormSchema = withPreprocessor(
  z.object({
    doc_num: z.string(),
    doc_date: z.string(),
    opisanie: z.string().optional(),
    spravochnik_podotchet_litso_id: z.number(),
    prixod: z.boolean(),
    rasxod: z.boolean(),
    childs: z.array(PodotchetOstatokProvodkaFormSchema)
  })
)

export type PodotchetOstatokFormValues = z.infer<typeof PodotchetOstatokFormSchema>
export type PodotchetOstatokProvodkaFormValues = z.infer<typeof PodotchetOstatokProvodkaFormSchema>
