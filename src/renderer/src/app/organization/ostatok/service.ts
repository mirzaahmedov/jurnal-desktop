import type { OrganizationOstatokPayload } from './utils'
import type { OrganizationOstatok } from '@/common/models'

import { withPreprocessor } from '@renderer/common/lib/validation'
import { z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { main_schet } from '@/common/features/crud/middleware'

export const organizationOstatokService = new CRUDService<
  OrganizationOstatok,
  OrganizationOstatokPayload
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
