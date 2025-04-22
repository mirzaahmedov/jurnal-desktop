import type { Region } from '@/common/models'

import { z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { withPreprocessor } from '@/common/lib/validation'

export const RegionFormSchema = withPreprocessor(
  z.object({
    name: z.string()
  })
)
export type RegionFormValues = z.infer<typeof RegionFormSchema>

export const RegionService = new CRUDService<Region, RegionFormValues>({
  endpoint: ApiEndpoints.region
})
