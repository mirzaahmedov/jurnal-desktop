import { z } from 'zod'

import { withPreprocessor } from '@/common/lib/validation'

export const mainSchetQueryKeys = {
  getAll: 'main-schet/all',
  getById: 'main-schet',
  create: 'main-schet/create',
  update: 'main-schet/update',
  delete: 'main-schet/delete'
}

const SchetSchema = z.object({
  id: z.number().optional(),
  schet: z.string().nonempty()
})
export const MainSchetFormSchema = withPreprocessor(
  z.object({
    spravochnik_budjet_name_id: z.number(),
    tashkilot_nomi: z.string(),
    tashkilot_bank: z.string(),
    tashkilot_mfo: z.string(),
    tashkilot_inn: z.string(),
    account_number: z.string(),
    gazna_number: z.string().optional(),
    account_name: z.string(),
    jur1_schet: z.string(),
    jur2_schet: z.string(),
    jur3_schets: z.array(SchetSchema),
    jur4_schets: z.array(SchetSchema)
  })
)
export type MainSchetFormValues = z.infer<typeof MainSchetFormSchema>

export const defaultValues: MainSchetFormValues = {
  spravochnik_budjet_name_id: 0,
  account_name: '',
  account_number: '',
  tashkilot_nomi: '',
  tashkilot_inn: '',
  tashkilot_mfo: '',
  tashkilot_bank: '',
  jur1_schet: '',
  jur2_schet: '',
  jur3_schets: [
    {
      schet: ''
    }
  ],
  jur4_schets: [
    {
      schet: ''
    }
  ]
}
