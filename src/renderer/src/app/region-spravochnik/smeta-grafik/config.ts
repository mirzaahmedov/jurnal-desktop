import { z } from 'zod'

import { withPreprocessor } from '@/common/lib/validation'

export const SmetaGrafikQueryKeys = {
  getAll: 'smeta-grafik/all',
  getById: 'smeta-grafik',
  create: 'smeta-grafik/create',
  update: 'smeta-grafik/all',
  delete: 'smeta-grafik/delete'
}

export const SmetaGrafikBatchFormSchema = z
  .object({
    year: withPreprocessor(z.number().min(1)),
    smetas: z.array(
      z.object({
        smeta_id: withPreprocessor(z.number().min(1)),
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
    )
  })
  .superRefine((values, ctx) => {
    const smetas = values.smetas
    smetas.forEach((smeta, index) => {
      if (smetas.find((s) => s.smeta_id === smeta.smeta_id && s !== smeta)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Проводка с этой сметой уже существует',
          path: ['smetas', index, 'smeta_id']
        })
      }
      if (
        smeta.oy_1 +
          smeta.oy_2 +
          smeta.oy_3 +
          smeta.oy_4 +
          smeta.oy_5 +
          smeta.oy_6 +
          smeta.oy_7 +
          smeta.oy_8 +
          smeta.oy_9 +
          smeta.oy_10 +
          smeta.oy_11 +
          smeta.oy_12 ===
        0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Сумма всех месяцев не может быть равна нулю',
          path: ['smetas', index, 'oy_1']
        })
      }
    })
  })
export type SmetaGrafikBatchFormValues = z.infer<typeof SmetaGrafikBatchFormSchema>
export const defaultBatchValues: SmetaGrafikBatchFormValues = {
  year: 0,
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

export const SmetaGrafikFormSchema = z.object({
  year: withPreprocessor(z.number()),
  smeta_id: withPreprocessor(z.number()),
  main_schet_id: withPreprocessor(z.number()).optional().nullable(),
  spravochnik_budjet_name_id: withPreprocessor(z.number()).optional().nullable(),
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
export type SmetaGrafikFormValues = z.infer<typeof SmetaGrafikFormSchema>

export const defaultValues: SmetaGrafikFormValues = {
  year: 0,
  smeta_id: 0,
  main_schet_id: 0,
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
