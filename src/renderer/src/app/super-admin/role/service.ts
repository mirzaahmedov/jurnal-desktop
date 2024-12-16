import type { Role } from '@/common/models'
import { z } from 'zod'
import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { withPreprocessor } from '@/common/lib/validation'

export const RolePayloadSchema = withPreprocessor(
  z.object({
    name: z.string()
  })
)
export type RolePayloadType = z.infer<typeof RolePayloadSchema>

export const roleService = new CRUDService<Role, RolePayloadType>({
  endpoint: ApiEndpoints.role
})
