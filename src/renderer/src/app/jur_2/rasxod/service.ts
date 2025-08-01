import type { ApiResponseMeta, BankRasxod } from '@/common/models'

import { z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { budjet, main_schet } from '@/common/features/crud/middleware'
import { withPreprocessor } from '@/common/lib/validation'

export const BankRasxodService = new CRUDService<
  BankRasxod,
  BankRasxodFormValues,
  BankRasxodFormValues,
  { summa: number } & ApiResponseMeta
>({
  endpoint: ApiEndpoints.bank_rasxod
})
  .use(main_schet())
  .use(budjet())

export const BankRasxodPodvodkaFormSchema = withPreprocessor(
  z.object({
    spravochnik_operatsii_id: z.number(),
    summa: z.number().min(1),
    id_spravochnik_podrazdelenie: z.number().optional(),
    id_spravochnik_sostav: z.number().optional(),
    id_spravochnik_podotchet_litso: z.number().optional(),
    id_spravochnik_type_operatsii: z.number().optional(),
    schet: z.any(),
    schet_6: z.any().optional(),
    sub_schet: z.any()
  })
)

export const BankRasxodFormSchema = withPreprocessor(
  z.object({
    doc_num: z.string(),
    doc_date: z.string(),
    id_spravochnik_organization: z.number(),
    shartnoma_grafik_id: z.number().optional(),
    organization_porucheniya_name: z.string().optional(),
    organization_by_raschet_schet_id: z.number(),
    organization_by_raschet_schet_gazna_id: z.number().optional(),
    summa: z.number().optional(),
    tulanmagan_summa: z.number().optional(),
    contract_summa: z.number().optional(),
    percentage: z.number().optional(),
    opisanie: z.string().optional(),
    rukovoditel: z.string().optional().nullable(),
    glav_buxgalter: z.string().optional().nullable(),
    id_shartnomalar_organization: z.number().optional(),
    childs: z.array(BankRasxodPodvodkaFormSchema)
  })
)

export type BankRasxodPodvodkaFormValues = z.infer<typeof BankRasxodPodvodkaFormSchema>
export type BankRasxodFormValues = z.infer<typeof BankRasxodFormSchema>

export const BankRasxodPaymentService = new CRUDService<undefined, { status: boolean }>({
  endpoint: ApiEndpoints.bank_rasxod_payment
})
  .use(main_schet())
  .use(budjet())
