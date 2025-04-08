import { z } from 'zod'

import { withPreprocessor } from '@/common/lib/validation'

export const queryKeys = {
  getById: 'akt',
  getAll: 'akt/all',
  create: 'akt/create',
  update: 'akt/update',
  delete: 'akt/delete'
}

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
    spravochnik_operatsii_own_id: z.number(),
    shartnomalar_organization_id: z.number().optional(),
    shartnoma_grafik_id: z.number().optional(),
    organization_by_raschet_schet_id: z.number(),
    organization_by_raschet_schet_gazna_id: z.number().optional(),
    childs: z.array(AktProvodkaFormSchema)
  })
)

export type AktFormValues = z.infer<typeof AktFormSchema>
export type AktProvodkaFormValues = z.infer<typeof AktProvodkaFormSchema>

export const defaultValues: AktFormValues = {
  doc_num: '',
  doc_date: '',
  summa: 0,
  id_spravochnik_organization: 0,
  spravochnik_operatsii_own_id: 0,
  organization_by_raschet_schet_id: 0,
  childs: [
    {
      spravochnik_operatsii_id: 0,
      kol: 0,
      sena: 0,
      nds_foiz: 0,
      id_spravochnik_podrazdelenie: 0,
      id_spravochnik_sostav: 0,
      id_spravochnik_type_operatsii: 0
    }
  ]
}
