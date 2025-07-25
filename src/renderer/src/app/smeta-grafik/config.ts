import { z } from 'zod'

import { withPreprocessor } from '@/common/lib/validation'

export const SmetaGrafikQueryKeys = {
  getAll: 'smeta-grafik/all',
  getOld: 'smeta-grafik/old',
  getById: 'smeta-grafik',
  create: 'smeta-grafik/create',
  update: 'smeta-grafik/all',
  delete: 'smeta-grafik/delete'
}

export const SmetaGrafikProvodkaFormSchema = z.object({
  id: z.number().optional(),
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
  oy_12: z.number(),
  smeta_id: z.number().min(1),
  smeta_number: z.string().optional(),
  itogo: z.number().optional(),
  sub_schet: z.string().optional()
})
export const SmetaGrafikFormSchema = withPreprocessor(
  z.object({
    year: z.number().min(1),
    command: z.string(),
    smetas: z.array(SmetaGrafikProvodkaFormSchema)
  })
)
export type SmetaGrafikProvodkaFormValues = z.infer<typeof SmetaGrafikProvodkaFormSchema>
export type SmetaGrafikFormValues = z.infer<typeof SmetaGrafikFormSchema>

export const defaultValues: SmetaGrafikFormValues = {
  year: new Date().getFullYear(),
  command: '',
  smetas: [
    {
      smeta_id: 0,
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
  ]
}
