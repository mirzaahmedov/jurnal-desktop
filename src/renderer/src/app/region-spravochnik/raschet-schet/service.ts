import type { RaschetSchet } from '@/common/models'

import { z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { withPreprocessor } from '@/common/lib/validation'

export const RaschetSchetFormSchema = withPreprocessor(
  z.object({
    raschet_schet: z.string().nonempty(),
    spravochnik_organization_id: z.number().optional()
  })
)
export type RaschetSchetFormValues = z.infer<typeof RaschetSchetFormSchema>

export const raschetSchetService = new CRUDService<RaschetSchet, RaschetSchetFormValues>({
  endpoint: ApiEndpoints.raschet_schet
})
