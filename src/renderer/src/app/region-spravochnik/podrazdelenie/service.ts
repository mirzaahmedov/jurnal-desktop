import type { Podrazdelenie } from '@/common/models'
import type { SpravochnikHookOptions } from '@/common/features/spravochnik'
import { z } from 'zod'
import { APIEndpoints, CRUDService } from '@/common/features/crud'
import { withPreprocessor } from '@/common/lib/validation'
import { extendObject } from '@/common/lib/utils'
import { subdivisionColumns } from './columns'
import { SpravochnikSearchField } from '@/common/features/search'

export const SubdivisionPayloadSchema = withPreprocessor(
  z.object({
    name: z.string(),
    rayon: z.string()
  })
)
export type SubdivisionPayloadType = z.infer<typeof SubdivisionPayloadSchema>

export const subdivisionService = new CRUDService<Podrazdelenie, SubdivisionPayloadType>({
  endpoint: APIEndpoints.podrazdelenie
})

export const createSubdivisionSpravochnik = (
  config: Partial<SpravochnikHookOptions<Podrazdelenie>>
) => {
  return extendObject(
    {
      title: 'Выберите подразделение',
      endpoint: APIEndpoints.podrazdelenie,
      columns: subdivisionColumns,
      service: subdivisionService,
      filters: [SpravochnikSearchField]
    } satisfies typeof config,
    config
  )
}
