import type { SpravochnikHookOptions } from '@/common/features/spravochnik'
import type { Budjet } from '@/common/models'

import { t } from 'i18next'
import { z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { extendObject } from '@/common/lib/utils'
import { withPreprocessor } from '@/common/lib/validation'

import { BudjetColumns } from './columns'

export const BudjetFormSchema = withPreprocessor(
  z.object({
    name: z.string()
  })
)
export type BudjetFormValues = z.infer<typeof BudjetFormSchema>

export const BudjetService = new CRUDService<Budjet, BudjetFormValues>({
  endpoint: ApiEndpoints.budjet_name
})

export const createBudjetSpravochnik = (config: Partial<SpravochnikHookOptions<Budjet>>) => {
  return extendObject(
    {
      title: t('budjet'),
      endpoint: ApiEndpoints.budjet_name,
      columnDefs: BudjetColumns,
      service: BudjetService
    } satisfies typeof config,
    config
  )
}
