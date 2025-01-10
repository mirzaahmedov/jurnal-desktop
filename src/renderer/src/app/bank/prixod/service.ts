import type { BankPrixodType, ResponseMeta } from '@/common/models'

import { APIEndpoints } from '@/common/features/crud'
import { CRUDService } from '@/common/features/crud'
import { main_schet } from '@/common/features/crud/middleware'
import { withPreprocessor } from '@/common/lib/validation'
import { z } from 'zod'

export const bankPrixodService = new CRUDService<
  BankPrixodType,
  PrixodPayloadType,
  PrixodPayloadType,
  { summa: number } & ResponseMeta
>({
  endpoint: APIEndpoints.bank_prixod
}).use(main_schet())

export const PrixodPodvodkaPayloadSchema = withPreprocessor(
  z.object({
    spravochnik_operatsii_id: z.number(),
    summa: z.number(),
    id_spravochnik_podrazdelenie: z.number().optional(),
    id_spravochnik_sostav: z.number().optional(),
    id_spravochnik_type_operatsii: z.number().optional(),
    id_spravochnik_podotchet_litso: z.number().optional()
  })
)

export const PrixodPayloadSchema = withPreprocessor(
  z.object({
    doc_num: z.string(),
    doc_date: z.string(),
    id_spravochnik_organization: z.number(),
    summa: z.number().optional(),
    opisanie: z.string().optional(),
    id_shartnomalar_organization: z.number().optional(),
    childs: z.array(PrixodPodvodkaPayloadSchema)
  })
)

export type PrixodPodvodkaPayloadType = z.infer<typeof PrixodPodvodkaPayloadSchema>
export type PrixodPayloadType = z.infer<typeof PrixodPayloadSchema>
