import { APIEndpoints, CRUDService } from '@/common/features/crud'

import type { Unit } from '@/common/models'
import { withPreprocessor } from '@/common/lib/validation'
import { z } from 'zod'

export const UnitFormSchema = withPreprocessor(
  z.object({
    name: z.string()
  })
)
export type UnitForm = z.infer<typeof UnitFormSchema>

export const unitService = new CRUDService<Unit, UnitForm>({
  endpoint: APIEndpoints.jur7_unit
})
