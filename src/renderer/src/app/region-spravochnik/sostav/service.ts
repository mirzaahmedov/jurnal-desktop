import type { SpravochnikHookOptions } from '@/common/features/spravochnik'
import type { Sostav } from '@/common/models'

import { z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { SpravochnikSearchField } from '@/common/features/search'
import { extendObject } from '@/common/lib/utils'
import { withPreprocessor } from '@/common/lib/validation'

import { sostavColumns } from './columns'

export const SostavFormSchema = withPreprocessor(
  z.object({
    name: z.string(),
    rayon: z.string()
  })
)
export type SostavFormValues = z.infer<typeof SostavFormSchema>

export const sostavService = new CRUDService<Sostav, SostavFormValues>({
  endpoint: ApiEndpoints.sostav
})

export const createSostavSpravochnik = (config: Partial<SpravochnikHookOptions<Sostav>>) => {
  return extendObject(
    {
      title: 'Выберите состав',
      endpoint: ApiEndpoints.sostav,
      columnDefs: sostavColumns,
      service: sostavService,
      filters: [SpravochnikSearchField]
    } satisfies typeof config,
    config
  )
}
