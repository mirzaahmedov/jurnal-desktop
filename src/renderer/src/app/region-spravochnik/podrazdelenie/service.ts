import type { SpravochnikHookOptions } from '@/common/features/spravochnik'
import type { Podrazdelenie } from '@/common/models'

import { z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { SpravochnikSearchField } from '@/common/features/search'
import { extendObject } from '@/common/lib/utils'
import { withPreprocessor } from '@/common/lib/validation'

import { subdivisionColumns } from './columns'

export const SubdivisionPayloadSchema = withPreprocessor(
  z.object({
    name: z.string(),
    rayon: z.string()
  })
)
export type SubdivisionPayloadType = z.infer<typeof SubdivisionPayloadSchema>

export const subdivisionService = new CRUDService<Podrazdelenie, SubdivisionPayloadType>({
  endpoint: ApiEndpoints.podrazdelenie
})

export const createSubdivisionSpravochnik = (
  config: Partial<SpravochnikHookOptions<Podrazdelenie>>
) => {
  return extendObject(
    {
      title: 'Выберите подразделение',
      endpoint: ApiEndpoints.podrazdelenie,
      columnDefs: subdivisionColumns,
      service: subdivisionService,
      filters: [SpravochnikSearchField]
    } satisfies typeof config,
    config
  )
}
