import { z } from 'zod'

import { withPreprocessor } from '@/common/lib/validation'

export const PereotsenkaQueryKeys = {
  getAll: 'pereotsenka/all',
  getById: 'pereotsenka',
  create: 'pereotsenka/create',
  update: 'pereotsenka/update',
  delete: 'pereotsenka/delete'
}

export const PereotsenkaFormSchema = withPreprocessor(
  z.object({
    name: z.string(),
    group_jur7_id: z.number(),
    pereotsenka_foiz: z.coerce.number()
  })
)
export const PereotsenkaBatchFormSchema = withPreprocessor(
  z.object({
    name: z.string(),
    array: z.array(
      z.object({
        group_jur7_id: z.number(),
        pereotsenka_foiz: z.number()
      })
    )
  })
)

export type PereotsenkaFormValues = z.infer<typeof PereotsenkaFormSchema>
export type PereotsenkaTableItem = PereotsenkaFormValues & {
  name: string
  schet: string
  iznos_foiz: number
  provodka_debet: string
  group_number: string
  provodka_kredit: string
}
export type PereotsenkaTable = {
  name: string
  array: PereotsenkaTableItem[]
}
export type PereotsenkaBatchForm = z.infer<typeof PereotsenkaBatchFormSchema>

export const defaultValues: PereotsenkaFormValues = {
  name: '',
  group_jur7_id: 0,
  pereotsenka_foiz: 0
}
export const defaultBatchValues: PereotsenkaTable = {
  name: '',
  array: []
}
