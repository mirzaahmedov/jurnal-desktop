import { APIEndpoints, CRUDService } from '@/common/features/crud'

import type { PokazatUslugi } from '@/common/models'
import { main_schet } from '@/common/features/crud/middleware'
import { withPreprocessor } from '@/common/lib/validation'
import { z } from 'zod'

export const pokazatUslugiService = new CRUDService<PokazatUslugi, PokazatUslugiForm>({
  endpoint: APIEndpoints.pokazat_uslugi
}).use(main_schet())

export const PokazatUslugiProvodkaFormSchema = withPreprocessor(
  z.object({
    spravochnik_operatsii_id: z.number(),
    kol: z.number().optional(),
    sena: z.number().optional(),
    nds_foiz: z.number().optional(),
    id_spravochnik_podrazdelenie: z.number().optional(),
    id_spravochnik_sostav: z.number().optional(),
    id_spravochnik_type_operatsii: z.number().optional()
  })
)
export const PokazatUslugiFormSchema = withPreprocessor(
  z.object({
    doc_num: z.string(),
    doc_date: z.string(),
    summa: z.coerce.number(),
    opisanie: z.string().optional(),
    spravochnik_operatsii_own_id: z.number(),
    id_spravochnik_organization: z.number(),
    shartnomalar_organization_id: z.number().optional(),
    childs: z.array(PokazatUslugiProvodkaFormSchema)
  })
)
export type PokazatUslugiForm = z.infer<typeof PokazatUslugiFormSchema>
export type PokazatUslugiProvodkaForm = z.infer<typeof PokazatUslugiProvodkaFormSchema>
