import type { Podotchet } from '@/common/models'
import type { SpravochnikHookOptions } from '@/common/features/spravochnik'

import { z } from 'zod'
import { APIEndpoints, CRUDService } from '@/common/features/crud'
import { withPreprocessor } from '@/common/lib/validation'
import { extendObject } from '@/common/lib/utils'
import { podotchetColumns } from './columns'
import { SpravochnikSearchField } from '@/common/features/search'

export const PodotchetFormSchema = withPreprocessor(
  z.object({
    name: z.string(),
    rayon: z.string()
  })
)
export type PodotchetForm = z.infer<typeof PodotchetFormSchema>

export const podotchetService = new CRUDService<Podotchet, PodotchetForm>({
  endpoint: APIEndpoints.podotchet_litso
})

export const createPodotchetSpravochnik = (config: Partial<SpravochnikHookOptions<Podotchet>>) => {
  return extendObject(
    {
      title: 'Выберите подотчетное лицо',
      endpoint: APIEndpoints.podotchet_litso,
      columns: podotchetColumns,
      service: podotchetService,
      filters: [SpravochnikSearchField]
    } satisfies typeof config,
    config
  )
}
