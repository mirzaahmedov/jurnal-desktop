import type { OrganizationOstatokPayload } from './utils'
import type { OrganizationOstatok, ResponseMeta } from '@/common/models'

import { z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { main_schet } from '@/common/features/crud/middleware'
import { withPreprocessor } from '@/common/lib/validation'

interface OrganOstatokMeta extends ResponseMeta {
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

export const organizationOstatokService = new CRUDService<
  OrganizationOstatok,
  OrganizationOstatokPayload,
  OrganizationOstatokPayload,
  OrganOstatokMeta
>({
  endpoint: ApiEndpoints.organ_saldo
}).use(main_schet())

export const OrganizationOstatokProvodkaFormSchema = withPreprocessor(
  z.object({
    spravochnik_operatsii_id: z.number(),
    summa: z.number().min(1),
    id_spravochnik_podrazdelenie: z.number().optional(),
    id_spravochnik_sostav: z.number().optional(),
    id_spravochnik_type_operatsii: z.number().optional()
  })
)

export const OrganizationOstatokFormSchema = withPreprocessor(
  z.object({
    doc_num: z.string(),
    doc_date: z.string(),
    opisanie: z.string().optional(),
    id_spravochnik_organization: z.number(),
    shartnomalar_organization_id: z.number().optional(),
    shartnoma_grafik_id: z.number().optional(),
    organization_by_raschet_schet_id: z.number(),
    organization_by_raschet_schet_gazna_id: z.number().optional(),
    prixod: z.boolean(),
    rasxod: z.boolean(),
    childs: z.array(OrganizationOstatokProvodkaFormSchema)
  })
)

export type OrganizationOstatokFormValues = z.infer<typeof OrganizationOstatokFormSchema>
export type OrganizationOstatokProvodkaFormValues = z.infer<
  typeof OrganizationOstatokProvodkaFormSchema
>
