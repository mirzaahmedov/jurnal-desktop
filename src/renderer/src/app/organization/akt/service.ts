import type { Akt } from '@/common/models/akt'

import { z } from 'zod'
import { CRUDService, ApiEndpoints } from '@/common/features/crud'
import { withPreprocessor } from '@/common/lib/validation'
import { main_schet } from '@/common/features/crud/middleware'

const aktService = new CRUDService<Akt, AktForm>({
  endpoint: ApiEndpoints.akt_priyom
}).use(main_schet())

const AktProvodkaFormSchema = withPreprocessor(
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
const AktFormSchema = withPreprocessor(
  z.object({
    doc_num: z.string(),
    doc_date: z.string(),
    summa: z.coerce.number(),
    opisanie: z.string().optional(),
    spravochnik_operatsii_own_id: z.number(),
    id_spravochnik_organization: z.number(),
    shartnomalar_organization_id: z.number().optional(),
    childs: z.array(AktProvodkaFormSchema)
  })
)

type AktForm = z.infer<typeof AktFormSchema>
type AktProvodkaForm = z.infer<typeof AktProvodkaFormSchema>

export { aktService, AktFormSchema, AktProvodkaFormSchema }
export type { AktForm, AktProvodkaForm }
