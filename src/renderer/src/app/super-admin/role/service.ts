import { APIEndpoints, CRUDService } from '@/common/features/crud'

import type { Role } from '@/common/models'
import { withPreprocessor } from '@/common/lib/validation'
import { z } from 'zod'

export const RolePayloadSchema = withPreprocessor(
  z.object({
    name: z.string()
  })
)
export type RolePayloadType = z.infer<typeof RolePayloadSchema>

export const roleService = new CRUDService<Role, RolePayloadType>({
  endpoint: APIEndpoints.role
})
