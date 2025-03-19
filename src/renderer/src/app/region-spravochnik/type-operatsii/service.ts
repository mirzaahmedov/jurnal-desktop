import type { SpravochnikHookOptions } from '@/common/features/spravochnik'
import type { TypeOperatsii } from '@/common/models'

import { SpravochnikSearchField } from '@renderer/common/features/search/spravochnik-search-field'
import { z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { extendObject } from '@/common/lib/utils'
import { withPreprocessor } from '@/common/lib/validation'

import { typeOperatsiiColumns } from './columns'

export const TypeOperatsiiFormSchema = withPreprocessor(
  z.object({
    name: z.string(),
    rayon: z.string()
  })
)
export type TypeOperatsiiFormValues = z.infer<typeof TypeOperatsiiFormSchema>

export const typeOperatsiiService = new CRUDService<TypeOperatsii, TypeOperatsiiFormValues>({
  endpoint: ApiEndpoints.type_operatsii
})

export const createTypeOperatsiiSpravochnik = (
  config: Partial<SpravochnikHookOptions<TypeOperatsii>>
) => {
  return extendObject(
    {
      title: 'Выберите тип операции',
      endpoint: ApiEndpoints.type_operatsii,
      columnDefs: typeOperatsiiColumns,
      service: typeOperatsiiService,
      filters: [SpravochnikSearchField]
    } satisfies typeof config,
    config
  )
}
