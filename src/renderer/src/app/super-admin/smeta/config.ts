import { z } from 'zod'

import { withPreprocessor } from '@/common/lib/validation'

const SmetaFormSchema = withPreprocessor(
  z.object({
    smeta_number: z.string().min(7, 'Длина номера сметы должна быть 7 символов'),
    smeta_name: z.string(),
    group_number: z.string(),
    father_smeta_name: z.string()
  })
)
type SmetaForm = z.infer<typeof SmetaFormSchema>

const smetaQueryKeys = {
  getAll: 'smeta/all',
  getById: 'smeta',
  create: 'smeta/create',
  update: 'smeta/update',
  delete: 'smeta/delete'
}
const defaultValues = {
  smeta_name: '',
  smeta_number: '',
  group_number: '',
  father_smeta_name: ''
}

export { SmetaFormSchema, smetaQueryKeys, defaultValues }
export type { SmetaForm }
