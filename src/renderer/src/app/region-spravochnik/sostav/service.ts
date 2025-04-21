import type { SpravochnikHookOptions } from '@/common/features/spravochnik'
import type { Sostav } from '@/common/models'

import { t } from 'i18next'
import { z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { SpravochnikSearchField } from '@/common/features/filters/search/search-filter-spravochnik'
import { extendObject } from '@/common/lib/utils'
import { withPreprocessor } from '@/common/lib/validation'

import { SostavColumns } from './columns'

export const SostavFormSchema = withPreprocessor(
  z.object({
    name: z.string(),
    rayon: z.string()
  })
)
export type SostavFormValues = z.infer<typeof SostavFormSchema>

export const SostavService = new CRUDService<Sostav, SostavFormValues>({
  endpoint: ApiEndpoints.sostav
})

export const createSostavSpravochnik = (config: Partial<SpravochnikHookOptions<Sostav>>) => {
  return extendObject(
    {
      title: t('sostav'),
      endpoint: ApiEndpoints.sostav,
      columnDefs: SostavColumns,
      service: SostavService,
      filters: [SpravochnikSearchField]
    } satisfies typeof config,
    config
  )
}
