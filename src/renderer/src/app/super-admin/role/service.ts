import type { Role } from '@/common/models'

import { z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { withPreprocessor } from '@/common/lib/validation'

export const RoleFormSchema = withPreprocessor(
  z.object({
    name: z.string()
  })
)
export type RoleFormValues = z.infer<typeof RoleFormSchema>

export const RoleService = new CRUDService<Role, RoleFormValues>({
  endpoint: ApiEndpoints.role
})
