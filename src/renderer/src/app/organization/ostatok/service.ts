import type { OrganizationOstatok } from '@/common/models'

import { withPreprocessor } from '@renderer/common/lib/validation'
import { z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { main_schet } from '@/common/features/crud/middleware'

export const organizationOstatokService = new CRUDService<
  OrganizationOstatok,
  OrganizationOstatokFormValues
>({
  endpoint: ApiEndpoints.organ_saldo
}).use(main_schet())

export const OrganizationOstatokProvodkaFormSchema = withPreprocessor(
  z.object({
    operatsii_id: z.number(),
    podraz_id: z.number().optional(),
    sostav_id: z.number().optional(),
    type_operatsii_id: z.number().optional(),
    summa: z.number()
  })
)

// Todo: remove unnecessary fields
export const OrganizationOstatokFormSchema = withPreprocessor(
  z.object({
    doc_num: z.string(),
    doc_date: z.string(),
    opisanie: z.string().optional(),
    organ_id: z.number(),
    organ_account_number_id: z.number().optional(),
    organ_gazna_number_id: z.number().optional(),
    contract_id: z.number().optional(),
    shartnoma_grafik_id: z.number().optional(),
    contract_grafik_id: z.number().optional().nullable(),
    prixod: z.boolean(),
    rasxod: z.boolean(),
    organization_by_raschet_schet_id: z.number().optional().nullable(),
    childs: z.array(OrganizationOstatokProvodkaFormSchema)
  })
)

export type OrganizationOstatokFormValues = z.infer<typeof OrganizationOstatokFormSchema>
export type OrganizationOstatokProvodkaFormValues = z.infer<
  typeof OrganizationOstatokProvodkaFormSchema
>
