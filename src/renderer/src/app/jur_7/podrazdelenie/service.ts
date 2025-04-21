import type { WarehousePodrazdelenieFormValues } from './config'
import type { SpravochnikHookOptions } from '@/common/features/spravochnik'
import type { WarehousePodrazdelenie } from '@/common/models'

import { t } from 'i18next'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { SpravochnikSearchField } from '@/common/features/filters/search/search-filter-spravochnik'
import { extendObject } from '@/common/lib/utils'

import { WarehousePodrazdelenieColumns } from './columns'

export const WarehousePodrazdelenieService = new CRUDService<
  WarehousePodrazdelenie,
  WarehousePodrazdelenieFormValues
>({
  endpoint: ApiEndpoints.jur7_podrazdelenie
})

export const createWarehousePodrazdelenieSpravochnik = (
  config: Partial<SpravochnikHookOptions<WarehousePodrazdelenie>>
) => {
  return extendObject(
    {
      title: t('podrazdelenie'),
      endpoint: ApiEndpoints.jur7_podrazdelenie,
      columnDefs: WarehousePodrazdelenieColumns,
      filters: [SpravochnikSearchField],
      service: WarehousePodrazdelenieService
    } satisfies typeof config,
    config
  )
}
