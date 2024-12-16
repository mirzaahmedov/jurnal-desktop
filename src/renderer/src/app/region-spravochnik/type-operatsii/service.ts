import type { SpravochnikHookOptions } from '@/common/features/spravochnik'
import { z } from 'zod'
import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { TypeOperatsii } from '@/common/models'
import { withPreprocessor } from '@/common/lib/validation'
import { extendObject } from '@/common/lib/utils'
import { operationTypeColumns } from './columns'
import { SpravochnikSearchField } from '@/common/features/search'

export const OperationTypePayloadSchema = withPreprocessor(
  z.object({
    name: z.string(),
    rayon: z.string()
  })
)
export type OperationTypePayloadType = z.infer<typeof OperationTypePayloadSchema>

export const operationTypeService = new CRUDService<TypeOperatsii, OperationTypePayloadType>({
  endpoint: ApiEndpoints.type_operatsii
})

export const createOperationTypeSpravochnik = (
  config: Partial<SpravochnikHookOptions<TypeOperatsii>>
) => {
  return extendObject(
    {
      title: 'Выберите тип операции',
      endpoint: ApiEndpoints.type_operatsii,
      columns: operationTypeColumns,
      service: operationTypeService,
      filters: [SpravochnikSearchField]
    } satisfies typeof config,
    config
  )
}
