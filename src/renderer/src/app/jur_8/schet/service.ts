import type { JUR8Schet } from '@/common/models'

import { z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { withPreprocessor } from '@/common/lib/validation'

export const JUR8SchetFormSchema = withPreprocessor(
  z.object({
    name: z.string().optional(),
    schet: z.string().optional(),
    schet_id: z.number()
  })
)
export type JUR8SchetFormValues = z.infer<typeof JUR8SchetFormSchema>

export const JUR8SchetService = new CRUDService<JUR8Schet, JUR8SchetFormValues>({
  endpoint: ApiEndpoints.jur8_schets
})
