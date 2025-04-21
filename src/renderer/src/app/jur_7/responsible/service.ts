import type { ResponsibleFormValues } from './config'
import type { SpravochnikHookOptions } from '@/common/features/spravochnik'
import type { Responsible } from '@/common/models'

import { t } from 'i18next'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { SpravochnikSearchField } from '@/common/features/filters/search/search-filter-spravochnik'
import { extendObject } from '@/common/lib/utils'

import { ResponsibleColumns } from './columns'

export const ResponsibleService = new CRUDService<Responsible, ResponsibleFormValues>({
  endpoint: ApiEndpoints.jur7_responsible
})

export const createResponsibleSpravochnik = (
  config: Partial<SpravochnikHookOptions<Responsible>>
) => {
  return extendObject(
    {
      endpoint: ApiEndpoints.jur7_responsible,
      columnDefs: ResponsibleColumns,
      service: ResponsibleService,
      filters: [SpravochnikSearchField],
      title: t('responsible')
    } satisfies typeof config,
    config
  )
}
