import type { Sostav } from '@/common/models'
import type { SpravochnikHookOptions } from '@/common/features/spravochnik'

import { z } from 'zod'
import { APIEndpoints, CRUDService } from '@/common/features/crud'
import { withPreprocessor } from '@/common/lib/validation'
import { extendObject } from '@/common/lib/utils'
import { SpravochnikSearchField } from '@/common/features/search'
import { sostavColumns } from './columns'

export const SostavFormSchema = withPreprocessor(
  z.object({
    name: z.string(),
    rayon: z.string()
  })
)
export type SostavForm = z.infer<typeof SostavFormSchema>

export const sostavService = new CRUDService<Sostav, SostavForm>({
  endpoint: APIEndpoints.sostav
})

export const createSostavSpravochnik = (config: Partial<SpravochnikHookOptions<Sostav>>) => {
  return extendObject(
    {
      title: 'Выберите состав',
      endpoint: APIEndpoints.sostav,
      columns: sostavColumns,
      service: sostavService,
      filters: [SpravochnikSearchField]
    } satisfies typeof config,
    config
  )
}
