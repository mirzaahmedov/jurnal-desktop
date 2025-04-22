import { z } from 'zod'

import { withPreprocessor } from '@/common/lib/validation'

export const AdminUserQueryKeys = {
  getAll: 'admin-user/all',
  getById: 'admin-user',
  create: 'admin-user/create',
  update: 'admin-user/update',
  delete: 'admin-user/delete'
}

export const AdminUserFormSchema = withPreprocessor(
  z.object({
    region_id: z.number(),
    fio: z.string(),
    login: z.string(),
    password: z.string()
  })
)
export type AdmonUserFormValues = z.infer<typeof AdminUserFormSchema>
