import { z } from 'zod'

import { withPreprocessor } from '@/common/lib/validation'

export const SmetaFormSchema = withPreprocessor(
  z.object({
    smeta_number: z.string().min(7, 'Длина номера сметы должна быть 7 символов'),
    smeta_name: z.string(),
    group_number: z.string(),
    father_smeta_name: z.string()
  })
)
export type SmetaForm = z.infer<typeof SmetaFormSchema>

export const SmetaQueryKeys = {
  getAll: 'smeta/all',
  getById: 'smeta',
  create: 'smeta/create',
  update: 'smeta/update',
  delete: 'smeta/delete'
}
export const defaultValues = {
  smeta_name: '',
  smeta_number: '',
  group_number: '',
  father_smeta_name: ''
}
