import type { PokazatUslugi } from '@/common/models'

import { z } from 'zod'

import { APIEndpoints, CRUDService } from '@/common/features/crud'
import { main_schet } from '@/common/features/crud/middleware'
import { validateProvodkaOperatsii, withPreprocessor } from '@/common/lib/validation'

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
    summa: z.coerce.number().min(1),
    opisanie: z.string().optional(),
    spravochnik_operatsii_own_id: z.number(),
    id_spravochnik_organization: z.number(),
    shartnoma_grafik_id: z.number().optional(),
    shartnomalar_organization_id: z.number().optional(),
    organization_by_raschet_schet_id: z.number(),
    organization_by_raschet_schet_gazna_id: z.number().optional(),
    childs: z.array(PokazatUslugiProvodkaFormSchema).superRefine(validateProvodkaOperatsii)
  })
)
export type PokazatUslugiForm = z.infer<typeof PokazatUslugiFormSchema>
export type PokazatUslugiProvodkaForm = z.infer<typeof PokazatUslugiProvodkaFormSchema>
