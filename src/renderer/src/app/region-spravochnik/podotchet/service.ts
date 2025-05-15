import type { SpravochnikHookOptions } from '@/common/features/spravochnik'
import type { Podotchet } from '@/common/models'

import { t } from 'i18next'
import { z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { SpravochnikSearchField } from '@/common/features/filters/search/search-filter-spravochnik'
import { extendObject } from '@/common/lib/utils'
import { withPreprocessor } from '@/common/lib/validation'

import { PodotchetColumns } from './columns'
import { PodotchetQueryKeys } from './config'
import { PodotchetDialog } from './dialog'

export const PodotchetFormSchema = withPreprocessor(
  z.object({
    name: z.string(),
    rayon: z.string(),
    position: z.string()
  })
)
export type PodotchetFormValues = z.infer<typeof PodotchetFormSchema>

export const PodotchetService = new CRUDService<Podotchet, PodotchetFormValues>({
  endpoint: ApiEndpoints.podotchet_litso
})

export const createPodotchetSpravochnik = (config: Partial<SpravochnikHookOptions<Podotchet>>) => {
  return extendObject(
    {
      title: t('podotchet-litso'),
      endpoint: ApiEndpoints.podotchet_litso,
      columnDefs: PodotchetColumns,
      service: PodotchetService,
      queryKeys: PodotchetQueryKeys,
      Dialog: PodotchetDialog,
      filters: [SpravochnikSearchField]
    } satisfies typeof config,
    config
  )
}
