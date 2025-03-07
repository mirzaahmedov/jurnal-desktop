import type { KassaPrixodType, ResponseMeta } from '@/common/models'

import { z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { main_schet } from '@/common/features/crud/middleware'
import { withPreprocessor } from '@/common/lib/validation'

export const kassaPrixodService = new CRUDService<
  KassaPrixodType,
  PrixodPayloadType,
  PrixodPayloadType,
  { summa: number } & ResponseMeta
>({
  endpoint: ApiEndpoints.kassa_prixod
}).use(main_schet())

export const PrixodPodvodkaPayloadSchema = withPreprocessor(
  z.object({
    spravochnik_operatsii_id: z.number(),
    summa: z.number().min(1),
    id_spravochnik_podrazdelenie: z.number().optional(),
    id_spravochnik_sostav: z.number().optional(),
    id_spravochnik_type_operatsii: z.number().optional()
  })
)

export const PrixodPayloadSchema = withPreprocessor(
  z.object({
    doc_num: z.string(),
    doc_date: z.string(),
    id_podotchet_litso: z.number().optional(),
    summa: z.number().optional(),
    opisanie: z.string().optional(),
    childs: z.array(PrixodPodvodkaPayloadSchema)
  })
)

export type PrixodPodvodkaPayloadType = z.infer<typeof PrixodPodvodkaPayloadSchema>
export type PrixodPayloadType = z.infer<typeof PrixodPayloadSchema>
