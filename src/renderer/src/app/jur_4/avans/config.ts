import { z } from 'zod'

import { withPreprocessor } from '@/common/lib/validation'

export const AvansQueryKeys = {
  getAll: 'avans/all',
  getById: 'avans',
  create: 'avans/create',
  update: 'avans/update',
  delete: 'avans/delete'
}

export const AvansProvodkaFormSchema = withPreprocessor(
  z.object({
    spravochnik_operatsii_id: z.number(),
    summa: z.number().min(1),
    id_spravochnik_podrazdelenie: z.number().optional(),
    id_spravochnik_sostav: z.number().optional(),
    id_spravochnik_type_operatsii: z.number().optional()
  })
)

export const AvansFormSchema = withPreprocessor(
  z.object({
    doc_num: z.string(),
    doc_date: z.string(),
    opisanie: z.string().optional(),
    spravochnik_podotchet_litso_id: z.number(),
    id_spravochnik_podotchet_litso: z.number(),
    spravochnik_operatsii_own_id: z.number(),
    summa: z.number().optional(),
    childs: z.array(AvansProvodkaFormSchema)
  })
)
export type AvansProvodkaFormValues = z.infer<typeof AvansProvodkaFormSchema>
export type AvansFormValues = z.infer<typeof AvansFormSchema>

export const defaultValues: AvansFormValues = {
  doc_num: '',
  doc_date: '',
  opisanie: '',
  spravochnik_podotchet_litso_id: 0,
  id_spravochnik_podotchet_litso: 0,
  spravochnik_operatsii_own_id: 0,
  summa: 0,
  childs: [
    {
      spravochnik_operatsii_id: 0,
      summa: 0,
      id_spravochnik_podrazdelenie: 0,
      id_spravochnik_sostav: 0,
      id_spravochnik_type_operatsii: 0
    }
  ]
}
