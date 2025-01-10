import { APIEndpoints, CRUDService } from '@/common/features/crud'

import type { Region } from '@/common/models'
import { withPreprocessor } from '@/common/lib/validation'
import { z } from 'zod'

export const RegionPayloadSchema = withPreprocessor(
  z.object({
    name: z.string()
  })
)
export type RegionPayloadType = z.infer<typeof RegionPayloadSchema>

export const regionService = new CRUDService<Region, RegionPayloadType>({
  endpoint: APIEndpoints.region
})
