import type { Akt } from '@/common/models/akt'
import type { ResponseMeta } from '@renderer/common/models'

import { z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { main_schet } from '@/common/features/crud/middleware'
import { withPreprocessor } from '@/common/lib/validation'

export const aktService = new CRUDService<
  Akt,
  AktFormValues,
  AktFormValues,
  ResponseMeta & { summa: number }
>({
  endpoint: ApiEndpoints.akt_priyom
}).use(main_schet())

export const AktProvodkaFormSchema = withPreprocessor(
  z.object({
    spravochnik_operatsii_id: z.number(),
    kol: z.number().min(1),
    sena: z.number().min(1),
    nds_foiz: z.number().optional(),
    id_spravochnik_podrazdelenie: z.number().optional(),
    id_spravochnik_sostav: z.number().optional(),
    id_spravochnik_type_operatsii: z.number().optional()
  })
)
export const AktFormSchema = withPreprocessor(
  z.object({
    doc_num: z.string(),
    doc_date: z.string(),
    summa: z.coerce.number().min(1),
    opisanie: z.string().optional(),
    id_spravochnik_organization: z.number(),
    shartnomalar_organization_id: z.number().optional(),
    shartnoma_grafik_id: z.number().optional(),
    organization_by_raschet_schet_id: z.number(),
    organization_by_raschet_schet_gazna_id: z.number().optional(),
    childs: z.array(AktProvodkaFormSchema)
  })
)

export type AktFormValues = z.infer<typeof AktFormSchema>
export type AktProvodkaFormValues = z.infer<typeof AktProvodkaFormSchema>
