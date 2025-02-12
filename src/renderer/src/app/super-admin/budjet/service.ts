import type { SpravochnikHookOptions } from '@/common/features/spravochnik'
import type { Budjet } from '@/common/models'

import { z } from 'zod'

import { APIEndpoints, CRUDService } from '@/common/features/crud'
import { extendObject } from '@/common/lib/utils'
import { withPreprocessor } from '@/common/lib/validation'

import { budgetColumns } from './columns'

export const BudgetPayloadSchema = withPreprocessor(
  z.object({
    name: z.string()
  })
)
export type BudgetPayloadType = z.infer<typeof BudgetPayloadSchema>

export const budgetService = new CRUDService<Budjet, BudgetPayloadType>({
  endpoint: APIEndpoints.budjet_name
})

export const createBudjetSpravochnik = (config: Partial<SpravochnikHookOptions<Budjet>>) => {
  return extendObject(
    {
      title: 'Выберите бюджет',
      endpoint: APIEndpoints.budjet_name,
      columnDefs: budgetColumns,
      service: budgetService
    } satisfies typeof config,
    config
  )
}
