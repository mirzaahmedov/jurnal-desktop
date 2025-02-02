import type { User } from '@/common/models'

import { z } from 'zod'

import { APIEndpoints, CRUDService } from '@/common/features/crud'
import { withPreprocessor } from '@/common/lib/validation'

export const RegionUserPayloadSchema = withPreprocessor(
  z.object({
    role_id: z.number(),
    fio: z.string(),
    login: z.string(),
    password: z.string()
  })
)
export type RegionUserPayloadType = z.infer<typeof RegionUserPayloadSchema>

export const regionUserService = new CRUDService<User, RegionUserPayloadType>({
  endpoint: APIEndpoints.region_user
})
