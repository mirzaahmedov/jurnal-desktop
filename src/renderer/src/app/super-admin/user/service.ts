import type { User } from '@/common/models'

import { z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { withPreprocessor } from '@/common/lib/validation'

export const AdminUserPayloadSchema = withPreprocessor(
  z.object({
    region_id: z.number(),
    fio: z.string(),
    login: z.string(),
    password: z.string()
  })
)
export type AdmonUserPayloadType = z.infer<typeof AdminUserPayloadSchema>

export const adminUserService = new CRUDService<User, AdmonUserPayloadType>({
  endpoint: ApiEndpoints.admin_user
})
