import type { ResponseMeta, BankRasxodType } from '@/common/models'
import { z } from 'zod'
import { CRUDService } from '@/common/features/crud'
import { ApiEndpoints } from '@/common/features/crud'
import { withPreprocessor } from '@/common/lib/validation'
import { main_schet } from '@/common/features/crud/middleware'

export const bankRasxodService = new CRUDService<
  BankRasxodType,
  RasxodPayloadType,
  RasxodPayloadType,
  { summa: number } & ResponseMeta
>({
  endpoint: ApiEndpoints.bank_rasxod
}).use(main_schet())

export const RasxodPodvodkaPayloadSchema = withPreprocessor(
  z.object({
    spravochnik_operatsii_id: z.number(),
    summa: z.number(),
    id_spravochnik_podrazdelenie: z.number().optional(),
    id_spravochnik_sostav: z.number().optional(),
    id_spravochnik_podotchet_litso: z.number().optional(),
    id_spravochnik_type_operatsii: z.number().optional()
  })
)

export const RasxodPayloadSchema = withPreprocessor(
  z.object({
    doc_num: z.string(),
    doc_date: z.string(),
    id_spravochnik_organization: z.number(),
    summa: z.number().optional(),
    opisanie: z.string().optional(),
    rukovoditel: z.string().optional().nullable(),
    glav_buxgalter: z.string().optional().nullable(),
    id_shartnomalar_organization: z.number().optional(),
    childs: z.array(RasxodPodvodkaPayloadSchema)
  })
)

export type RasxodPodvodkaPayloadType = z.infer<typeof RasxodPodvodkaPayloadSchema>
export type RasxodPayloadType = z.infer<typeof RasxodPayloadSchema>
