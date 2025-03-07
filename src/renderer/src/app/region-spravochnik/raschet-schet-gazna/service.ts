import type { RaschetSchetGazna } from '@/common/models'

import { z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { withPreprocessor } from '@/common/lib/validation'

export const RaschetSchetGaznaFormSchema = withPreprocessor(
  z.object({
    raschet_schet_gazna: z.string().nonempty(),
    spravochnik_organization_id: z.number().optional()
  })
)
export type RaschetSchetGaznaFormValues = z.infer<typeof RaschetSchetGaznaFormSchema>

export const raschetSchetGaznaService = new CRUDService<
  RaschetSchetGazna,
  RaschetSchetGaznaFormValues
>({
  endpoint: ApiEndpoints.raschet_schet_gazna
})
