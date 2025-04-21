import type { SpravochnikHookOptions } from '@/common/features/spravochnik'
import type { Podrazdelenie } from '@/common/models'

import { t } from 'i18next'
import { z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { SpravochnikSearchField } from '@/common/features/filters/search/search-filter-spravochnik'
import { extendObject } from '@/common/lib/utils'
import { withPreprocessor } from '@/common/lib/validation'

import { PodrazdelenieColumns } from './columns'

export const PodrazdelenieFormSchema = withPreprocessor(
  z.object({
    name: z.string(),
    rayon: z.string()
  })
)
export type PodrazdelenieFormValues = z.infer<typeof PodrazdelenieFormSchema>

export const PodrazdelenieService = new CRUDService<Podrazdelenie, PodrazdelenieFormValues>({
  endpoint: ApiEndpoints.podrazdelenie
})

export const createPodrazdelenieSpravochnik = (
  config: Partial<SpravochnikHookOptions<Podrazdelenie>>
) => {
  return extendObject(
    {
      title: t('podrazdelenie'),
      endpoint: ApiEndpoints.podrazdelenie,
      columnDefs: PodrazdelenieColumns,
      service: PodrazdelenieService,
      filters: [SpravochnikSearchField]
    } satisfies typeof config,
    config
  )
}
