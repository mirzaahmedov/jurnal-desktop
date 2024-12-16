import type { PokazatUslugi } from '@/common/models'

import { z } from 'zod'
import { withPreprocessor } from '@/common/lib/validation'
import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { main_schet } from '@/common/features/crud/middleware'

export const pokazatUslugiService = new CRUDService<PokazatUslugi, PokazatUslugiForm>({
  endpoint: ApiEndpoints.pokazat_uslugi
}).use(main_schet())

export const PokazatUslugiProvodkaFormSchema = withPreprocessor(
  z.object({
    spravochnik_operatsii_id: z.number(),
    kol: z.number(),
    sena: z.number(),
    nds_foiz: z.number(),
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
