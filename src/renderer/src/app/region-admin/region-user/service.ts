import type { User } from '@/common/models'

import { z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { withPreprocessor } from '@/common/lib/validation'

export const RegionUserFormSchema = withPreprocessor(
  z.object({
    role_id: z.number(),
    fio: z.string(),
    login: z.string(),
    password: z.string()
  })
)
export type RegionUserFormValues = z.infer<typeof RegionUserFormSchema>

export const RegionUserService = new CRUDService<User, RegionUserFormValues>({
  endpoint: ApiEndpoints.region_user
})
