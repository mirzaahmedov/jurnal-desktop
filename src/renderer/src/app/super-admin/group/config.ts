import { z } from 'zod'

import { withPreprocessor } from '@/common/lib/validation'

export const GroupQueryKeys = {
  getAll: 'group/all',
  getLatest: 'group/latest',
  getById: 'group',
  create: 'group/create',
  update: 'group/update',
  delete: 'group/delete'
}

export const GroupFormSchema = withPreprocessor(
  z.object({
    smeta_id: z.number(),
    name: z.string(),
    schet: z.string(),
    group_number: z.string(),
    iznos_foiz: z.coerce.number().optional(),
    provodka_debet: z.string(),
    provodka_subschet: z.string(),
    provodka_kredit: z.string(),
    pod_group: z.string().nonempty()
  })
)

export type GroupFormValues = z.infer<typeof GroupFormSchema>

export const defaultValues: GroupFormValues = {
  smeta_id: 0,
  name: '',
  schet: '',
  group_number: '',
  iznos_foiz: 0,
  provodka_debet: '',
  provodka_subschet: '',
  provodka_kredit: '',
  pod_group: ''
}
