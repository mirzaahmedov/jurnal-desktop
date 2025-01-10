import { APIEndpoints, CRUDService } from '@renderer/common/features/crud'
import type { BankRasxod, ResponseMeta } from '@renderer/common/models'

import { main_schet } from '@renderer/common/features/crud/middleware'
import { withPreprocessor } from '@renderer/common/lib/validation'
import { z } from 'zod'

export const bankRasxodService = new CRUDService<
  BankRasxod,
  RasxodPayloadType,
  RasxodPayloadType,
  { summa: number } & ResponseMeta
>({
  endpoint: APIEndpoints.bank_rasxod
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

export const bankRasxodPaymentService = new CRUDService<undefined, { status: boolean }>({
  endpoint: APIEndpoints.bank_rasxod_payment
}).use(main_schet())
