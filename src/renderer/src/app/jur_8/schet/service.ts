import type { PrixodSchet } from '@/common/models'

import { z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { withPreprocessor } from '@/common/lib/validation'

export const PrixodSchetFormSchema = withPreprocessor(
  z.object({
    name: z.string().optional(),
    schet: z.string().optional(),
    schet_id: z.number()
  })
)
export type PrixodSchetFormValues = z.infer<typeof PrixodSchetFormSchema>

export const PrixodSchetService = new CRUDService<PrixodSchet, PrixodSchetFormValues>({
  endpoint: ApiEndpoints.jur8_schets
})
