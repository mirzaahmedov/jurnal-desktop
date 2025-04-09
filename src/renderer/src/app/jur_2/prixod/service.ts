import type { BankPrixod, ResponseMeta } from '@/common/models'

import { z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { main_schet } from '@/common/features/crud/middleware'
import { withPreprocessor } from '@/common/lib/validation'

export const BankPrixodService = new CRUDService<
  BankPrixod,
  BankPrixodFormValues,
  BankPrixodFormValues,
  { summa: number } & ResponseMeta
>({
  endpoint: ApiEndpoints.bank_prixod
}).use(main_schet())

export const BankPrixodProvodkaFormSchema = withPreprocessor(
  z.object({
    spravochnik_operatsii_id: z.number(),
    summa: z.number().min(1),
    id_spravochnik_podrazdelenie: z.number().optional(),
    id_spravochnik_sostav: z.number().optional(),
    id_spravochnik_type_operatsii: z.number().optional(),
    id_spravochnik_podotchet_litso: z.number().optional()
  })
)

export const BankPrixodFormSchema = withPreprocessor(
  z.object({
    doc_num: z.string(),
    doc_date: z.string(),
    id_spravochnik_organization: z.number(),
    summa: z.number().optional(),
    opisanie: z.string().optional(),
    shartnoma_grafik_id: z.number().optional(),
    id_shartnomalar_organization: z.number().optional(),
    organization_by_raschet_schet_id: z.number(),
    organization_by_raschet_schet_gazna_id: z.number().optional(),
    childs: z.array(BankPrixodProvodkaFormSchema)
  })
)

export type BankPrixodProvodkaFormValues = z.infer<typeof BankPrixodProvodkaFormSchema>
export type BankPrixodFormValues = z.infer<typeof BankPrixodFormSchema>
