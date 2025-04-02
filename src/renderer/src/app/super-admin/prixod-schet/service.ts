import type { PrixodSchet } from '@/common/models'

import { z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { withPreprocessor } from '@/common/lib/validation'

export const PrixodSchetFormSchema = withPreprocessor(
  z.object({
    name: z.string(),
    schet: z.string()
  })
)
export type PrixodSchetFormValues = z.infer<typeof PrixodSchetFormSchema>

export const PrixodSchetService = new CRUDService<PrixodSchet, PrixodSchetFormValues>({
  endpoint: ApiEndpoints.admin_prixod_schets
})
