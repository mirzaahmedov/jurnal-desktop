import type { BankRasxod, ResponseMeta } from '@renderer/common/models'

import { APIEndpoints, CRUDService } from '@renderer/common/features/crud'
import { main_schet } from '@renderer/common/features/crud/middleware'
import { validateProvodkaOperatsii, withPreprocessor } from '@renderer/common/lib/validation'
import { ZodIssueCode, z } from 'zod'

export const bankRasxodService = new CRUDService<
  BankRasxod,
  RasxodFormValues,
  RasxodFormValues,
  { summa: number } & ResponseMeta
>({
  endpoint: APIEndpoints.bank_rasxod
}).use(main_schet())

export const RasxodPodvodkaFormSchema = withPreprocessor(
  z.object({
    spravochnik_operatsii_id: z.number(),
    summa: z.number().min(1),
    id_spravochnik_podrazdelenie: z.number().optional(),
    id_spravochnik_sostav: z.number().optional(),
    id_spravochnik_podotchet_litso: z.number().optional(),
    id_spravochnik_type_operatsii: z.number().optional()
  })
)

export const RasxodFormSchema = withPreprocessor(
  z
    .object({
      doc_num: z.string(),
      doc_date: z.string(),
      id_spravochnik_organization: z.number(),
      organization_by_raschet_schet_id: z.number().optional(),
      organization_by_raschet_schet_gazna_id: z.number().optional(),
      summa: z.number().optional(),
      tulanmagan_summa: z.number().optional(),
      opisanie: z.string().optional(),
      rukovoditel: z.string().optional().nullable(),
      glav_buxgalter: z.string().optional().nullable(),
      id_shartnomalar_organization: z.number().optional(),
      childs: z.array(RasxodPodvodkaFormSchema).superRefine(validateProvodkaOperatsii)
    })
    .superRefine((values, ctx) => {
      if (
        values.organization_by_raschet_schet_id &&
        values.organization_by_raschet_schet_gazna_id
      ) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          path: ['organization_by_raschet_schet_gazna_id'],
          message: "Hisob raqami va g'azna hisob raqami bir vaqtda tanlash mumkin emas"
        })
      }

      if (
        !values.organization_by_raschet_schet_id &&
        !values.organization_by_raschet_schet_gazna_id
      ) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          path: ['organization_by_raschet_schet_gazna_id'],
          message: 'Hisob raqami yoki ganza hisob raqamini tanlash majburiy'
        })
      }
    })
)

export type RasxodPodvodkaFormValues = z.infer<typeof RasxodPodvodkaFormSchema>
export type RasxodFormValues = z.infer<typeof RasxodFormSchema>

export const bankRasxodPaymentService = new CRUDService<undefined, { status: boolean }>({
  endpoint: APIEndpoints.bank_rasxod_payment
}).use(main_schet())
