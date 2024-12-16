import { z } from 'zod'
import { withPreprocessor } from '@/common/lib/validation'

const pereotsenkaQueryKeys = {
  getAll: 'pereotsenka/all',
  getById: 'pereotsenka',
  create: 'pereotsenka/create',
  update: 'pereotsenka/update',
  delete: 'pereotsenka/delete'
}

const PereotsenkaFormSchema = withPreprocessor(
  z.object({
    name: z.string(),
    group_jur7_id: z.number(),
    pereotsenka_foiz: z.coerce.number()
  })
)
const PereotsenkaBatchFormSchema = withPreprocessor(
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

type PereotsenkaForm = z.infer<typeof PereotsenkaFormSchema>
type PereotsenkaTableItem = PereotsenkaForm & {
  name: string
  schet: string
  iznos_foiz: number
  provodka_debet: string
  group_number: string
  provodka_kredit: string
}
type PereotsenkaTable = {
  name: string
  array: PereotsenkaTableItem[]
}
type PereotsenkaBatchForm = z.infer<typeof PereotsenkaBatchFormSchema>

const defaultValues: PereotsenkaForm = {
  name: '',
  group_jur7_id: 0,
  pereotsenka_foiz: 0
}
const defaultBatchValues: PereotsenkaTable = {
  name: '',
  array: []
}

export {
  pereotsenkaQueryKeys,
  defaultValues,
  defaultBatchValues,
  PereotsenkaFormSchema,
  PereotsenkaBatchFormSchema
}
export type { PereotsenkaForm, PereotsenkaTable, PereotsenkaTableItem, PereotsenkaBatchForm }
