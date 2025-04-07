import type { MainSchetFormValues } from './config'
import type { SpravochnikHookOptions } from '@/common/features/spravochnik'
import type { MainSchet } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { SpravochnikSearchField } from '@/common/features/filters/search/search-filter-spravochnik'
import { extendObject } from '@/common/lib/utils'

import { mainSchetColumns } from './columns'

export const mainSchetService = new CRUDService<MainSchet, MainSchetFormValues>({
  endpoint: ApiEndpoints.main_schet
})

export const createMainSchetSpravochnik = (config: SpravochnikHookOptions<MainSchet>) => {
  return extendObject(
    {
      title: 'Выберите основной счет',
      endpoint: ApiEndpoints.main_schet,
      columnDefs: mainSchetColumns,
      service: mainSchetService,
      filters: [SpravochnikSearchField]
    } satisfies typeof config,
    config
  )
}
