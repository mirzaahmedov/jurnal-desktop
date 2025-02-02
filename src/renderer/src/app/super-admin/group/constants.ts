import { z } from 'zod'

import { withPreprocessor } from '@/common/lib/validation'

export const groupQueryKeys = {
  getAll: 'groups/all',
  getLatest: 'group/latest',
  getById: 'groups',
  create: 'groups/create',
  update: 'groups/update',
  delete: 'groups/delete'
}

export const GroupPayloadSchema = withPreprocessor(
  z.object({
    smeta_id: z.number(),
    name: z.string(),
    schet: z.string(),
    group_number: z.string(),
    iznos_foiz: z.coerce.number(),
    provodka_debet: z.string(),
    provodka_subschet: z.string(),
    provodka_kredit: z.string(),
    pod_group: z.string().nonempty()
  })
)

export type GroupPayloadType = z.infer<typeof GroupPayloadSchema>

export const defaultValues: GroupPayloadType = {
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
