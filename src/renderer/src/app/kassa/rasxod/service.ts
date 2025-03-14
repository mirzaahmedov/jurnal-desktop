import type { KassaRasxodType, ResponseMeta } from '@/common/models'

import { ZodIssueCode, z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { main_schet } from '@/common/features/crud/middleware'
import { withPreprocessor } from '@/common/lib/validation'

export const kassaRasxodService = new CRUDService<
  KassaRasxodType,
  RasxodPayloadType,
  RasxodPayloadType,
  { summa: number } & ResponseMeta
>({
  endpoint: ApiEndpoints.kassa_rasxod
}).use(main_schet())

export const RasxodPodvodkaPayloadSchema = withPreprocessor(
  z.object({
    spravochnik_operatsii_id: z.number(),
    summa: z.number().min(1),
    id_spravochnik_podrazdelenie: z.number().optional(),
    id_spravochnik_sostav: z.number().optional(),
    id_spravochnik_type_operatsii: z.number().optional()
  })
)

export const RasxodPayloadSchema = withPreprocessor(
  z
    .object({
      doc_num: z.string(),
      doc_date: z.string(),
      id_podotchet_litso: z.number().optional(),
      main_zarplata_id: z.number().optional(),
      is_zarplata: z.boolean().optional(),
      opisanie: z.string().optional(),
      summa: z.number().optional(),
      childs: z.array(RasxodPodvodkaPayloadSchema)
    })
    .superRefine((values, ctx) => {
      if (values.is_zarplata && !values.main_zarplata_id) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          path: ['main_zarplata_id']
        })
        return
      }

      if (!values.is_zarplata && !values.id_podotchet_litso) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          path: ['id_podotchet_litso']
        })
        return
      }
    })
)

export type RasxodPodvodkaPayloadType = z.infer<typeof RasxodPodvodkaPayloadSchema>
export type RasxodPayloadType = z.infer<typeof RasxodPayloadSchema>
