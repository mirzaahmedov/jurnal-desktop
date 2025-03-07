import type { Akt } from '@/common/models/akt'
import type { ResponseMeta } from '@renderer/common/models'

import { z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { main_schet } from '@/common/features/crud/middleware'
import { withPreprocessor } from '@/common/lib/validation'

const aktService = new CRUDService<Akt, AktForm, AktForm, ResponseMeta & { summa: number }>({
  endpoint: ApiEndpoints.akt_priyom
}).use(main_schet())

const AktProvodkaFormSchema = withPreprocessor(
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
const AktFormSchema = withPreprocessor(
  z.object({
    doc_num: z.string(),
    doc_date: z.string(),
    summa: z.coerce.number().min(1),
    opisanie: z.string().optional(),
    spravochnik_operatsii_own_id: z.number(),
    id_spravochnik_organization: z.number(),
    shartnomalar_organization_id: z.number().optional(),
    shartnoma_grafik_id: z.number().optional(),
    organization_by_raschet_schet_id: z.number(),
    organization_by_raschet_schet_gazna_id: z.number().optional(),
    childs: z.array(AktProvodkaFormSchema)
  })
)

type AktForm = z.infer<typeof AktFormSchema>
type AktProvodkaForm = z.infer<typeof AktProvodkaFormSchema>

export { AktFormSchema, AktProvodkaFormSchema, aktService }
export type { AktForm, AktProvodkaForm }
