import type { Region } from '@/common/models'

import { z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { withPreprocessor } from '@/common/lib/validation'

export const RegionPayloadSchema = withPreprocessor(
  z.object({
    name: z.string()
  })
)
export type RegionPayloadType = z.infer<typeof RegionPayloadSchema>

export const regionService = new CRUDService<Region, RegionPayloadType>({
  endpoint: ApiEndpoints.region
})
