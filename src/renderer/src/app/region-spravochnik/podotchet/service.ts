import type { SpravochnikHookOptions } from '@/common/features/spravochnik'
import type { Podotchet } from '@/common/models'

import { z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { SpravochnikSearchField } from '@/common/features/filters/search/search-filter-spravochnik'
import { extendObject } from '@/common/lib/utils'
import { withPreprocessor } from '@/common/lib/validation'

import { podotchetColumns } from './columns'
import { podotchetQueryKeys } from './constants'
import PodotchetDialog from './dialog'

export const PodotchetFormSchema = withPreprocessor(
  z.object({
    name: z.string(),
    rayon: z.string()
  })
)
export type PodotchetFormValues = z.infer<typeof PodotchetFormSchema>

export const podotchetService = new CRUDService<Podotchet, PodotchetFormValues>({
  endpoint: ApiEndpoints.podotchet_litso
})

export const createPodotchetSpravochnik = (config: Partial<SpravochnikHookOptions<Podotchet>>) => {
  return extendObject(
    {
      title: 'Выберите подотчетное лицо',
      endpoint: ApiEndpoints.podotchet_litso,
      columnDefs: podotchetColumns,
      service: podotchetService,
      queryKeys: podotchetQueryKeys,
      Dialog: PodotchetDialog,
      filters: [SpravochnikSearchField]
    } satisfies typeof config,
    config
  )
}
