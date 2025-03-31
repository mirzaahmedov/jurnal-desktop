import type { SpravochnikHookOptions } from '@/common/features/spravochnik'
import type { Podrazdelenie } from '@/common/models'

import { SpravochnikSearchField } from '@renderer/common/features/filters/search/search-filter-spravochnik'
import { z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { extendObject } from '@/common/lib/utils'
import { withPreprocessor } from '@/common/lib/validation'

import { podrazdelenieColumns } from './columns'

export const PodrazdelenieFormSchema = withPreprocessor(
  z.object({
    name: z.string(),
    rayon: z.string()
  })
)
export type PodrazdelenieFormValues = z.infer<typeof PodrazdelenieFormSchema>

export const podrazdelenieService = new CRUDService<Podrazdelenie, PodrazdelenieFormValues>({
  endpoint: ApiEndpoints.podrazdelenie
})

export const createPodrazdelenieSpravochnik = (
  config: Partial<SpravochnikHookOptions<Podrazdelenie>>
) => {
  return extendObject(
    {
      title: 'Выберите подразделение',
      endpoint: ApiEndpoints.podrazdelenie,
      columnDefs: podrazdelenieColumns,
      service: podrazdelenieService,
      filters: [SpravochnikSearchField]
    } satisfies typeof config,
    config
  )
}
