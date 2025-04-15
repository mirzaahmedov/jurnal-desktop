import { z } from 'zod'

import { withPreprocessor } from '@/common/lib/validation'

export const queryKeys = {
  getById: 'pokazat-uslugi',
  getAll: 'pokazat-uslugi/all',
  create: 'pokazat-uslugi/create',
  update: 'pokazat-uslugi/update',
  delete: 'pokazat-uslugi/delete'
}

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
    id_spravochnik_organization: z.number(),
    shartnoma_grafik_id: z.number().optional(),
    shartnomalar_organization_id: z.number().optional(),
    organization_by_raschet_schet_id: z.number(),
    organization_by_raschet_schet_gazna_id: z.number().optional(),
    childs: z.array(PokazatUslugiProvodkaFormSchema)
  })
)
export type PokazatUslugiFormValues = z.infer<typeof PokazatUslugiFormSchema>
export type PokazatUslugiProvodkaFormValues = z.infer<typeof PokazatUslugiProvodkaFormSchema>

export const defaultValues: PokazatUslugiFormValues = {
  doc_num: '',
  doc_date: '',
  summa: 0,
  id_spravochnik_organization: 0,
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
