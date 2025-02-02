import { z } from 'zod'

import { validateProvodkaOperatsii, withPreprocessor } from '@/common/lib/validation'

export const avansQueryKeys = {
  getAll: 'avans/all',
  getById: 'avans',
  create: 'avans/create',
  update: 'avans/update',
  delete: 'avans/delete'
}

export const AdvanceReportPodvodkaPayloadSchema = withPreprocessor(
  z.object({
    spravochnik_operatsii_id: z.number(),
    summa: z.number().min(1),
    id_spravochnik_podrazdelenie: z.number().optional(),
    id_spravochnik_sostav: z.number().optional(),
    id_spravochnik_type_operatsii: z.number().optional()
  })
)
export type AdvanceReportPodvodkaPayloadType = z.infer<typeof AdvanceReportPodvodkaPayloadSchema>

export const AdvanceReportPayloadSchema = withPreprocessor(
  z.object({
    doc_num: z.string(),
    doc_date: z.string(),
    opisanie: z.string().optional(),
    spravochnik_podotchet_litso_id: z.number(),
    spravochnik_operatsii_own_id: z.number(),
    summa: z.number().optional(),
    childs: z.array(AdvanceReportPodvodkaPayloadSchema).superRefine(validateProvodkaOperatsii)
  })
)
export type AdvanceReportPayloadType = z.infer<typeof AdvanceReportPayloadSchema>

export const defaultValues: AdvanceReportPayloadType = {
  doc_num: '',
  doc_date: '',
  opisanie: '',
  spravochnik_podotchet_litso_id: 0,
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
