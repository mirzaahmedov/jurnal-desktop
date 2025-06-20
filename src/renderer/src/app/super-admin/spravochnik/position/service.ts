import type { Position } from '@/common/models'

import { z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { withPreprocessor } from '@/common/lib/validation'

export const PositionFormSchema = withPreprocessor(
  z.object({
    name: z.string()
  })
)
export type PositionFormValues = z.infer<typeof PositionFormSchema>

export const PositionService = new CRUDService<Position, PositionFormValues>({
  endpoint: ApiEndpoints.admin_position
})
