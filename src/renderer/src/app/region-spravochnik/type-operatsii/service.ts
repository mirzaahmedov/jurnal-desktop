import type { SpravochnikHookOptions } from '@/common/features/spravochnik'
import type { TypeOperatsii } from '@/common/models'

import { t } from 'i18next'
import { z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { SpravochnikSearchField } from '@/common/features/filters/search/search-filter-spravochnik'
import { extendObject } from '@/common/lib/utils'
import { withPreprocessor } from '@/common/lib/validation'

import { TypeOperatsiiColumns } from './columns'

export const TypeOperatsiiFormSchema = withPreprocessor(
  z.object({
    name: z.string(),
    rayon: z.string()
  })
)
export type TypeOperatsiiFormValues = z.infer<typeof TypeOperatsiiFormSchema>

export const TypeOperatsiiService = new CRUDService<TypeOperatsii, TypeOperatsiiFormValues>({
  endpoint: ApiEndpoints.type_operatsii
})

export const createTypeOperatsiiSpravochnik = (
  config: Partial<SpravochnikHookOptions<TypeOperatsii>>
) => {
  return extendObject(
    {
      title: t('pages.type-operatsii', { ns: 'app' }),
      endpoint: ApiEndpoints.type_operatsii,
      columnDefs: TypeOperatsiiColumns,
      service: TypeOperatsiiService,
      filters: [SpravochnikSearchField]
    } satisfies typeof config,
    config
  )
}
