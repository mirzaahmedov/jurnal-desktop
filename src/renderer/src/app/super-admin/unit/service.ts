import type { Unit } from '@/common/models'

import { z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { withPreprocessor } from '@/common/lib/validation'

export const UnitFormSchema = withPreprocessor(
  z.object({
    name: z.string()
  })
)
export type UnitForm = z.infer<typeof UnitFormSchema>

export const unitService = new CRUDService<Unit, UnitForm>({
  endpoint: ApiEndpoints.jur7_unit
})
