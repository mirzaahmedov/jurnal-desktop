import { z } from 'zod'

import { withPreprocessor } from '@/common/lib/validation'

export const smetaGrafikQueryKeys = {
  getAll: 'smeta-grafik/all',
  getById: 'smeta-grafik',
  create: 'smeta-grafik/create',
  update: 'smeta-grafik/all',
  delete: 'smeta-grafik/delete'
}

export const SmetaGrafikFormSchema = z.object({
  year: withPreprocessor(z.number()),
  smeta_id: withPreprocessor(z.number()),
  spravochnik_budjet_name_id: withPreprocessor(z.number()),
  oy_1: z.number(),
  oy_2: z.number(),
  oy_3: z.number(),
  oy_4: z.number(),
  oy_5: z.number(),
  oy_6: z.number(),
  oy_7: z.number(),
  oy_8: z.number(),
  oy_9: z.number(),
  oy_10: z.number(),
  oy_11: z.number(),
  oy_12: z.number()
})
export type SmetaGrafikForm = z.infer<typeof SmetaGrafikFormSchema>

export const defaultValues: SmetaGrafikForm = {
  year: 0,
  smeta_id: 0,
  spravochnik_budjet_name_id: 0,
  oy_1: 0,
  oy_2: 0,
  oy_3: 0,
  oy_4: 0,
  oy_5: 0,
  oy_6: 0,
  oy_7: 0,
  oy_8: 0,
  oy_9: 0,
  oy_10: 0,
  oy_11: 0,
  oy_12: 0
}
