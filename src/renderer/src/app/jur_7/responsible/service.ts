import type { ResponsibleFormValues } from './constants'
import type { SpravochnikHookOptions } from '@/common/features/spravochnik'
import type { Responsible } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { SpravochnikSearchField } from '@/common/features/filters/search/search-filter-spravochnik'
import { extendObject } from '@/common/lib/utils'

import { responsibleColumns } from './columns'

export const responsibleService = new CRUDService<Responsible, ResponsibleFormValues>({
  endpoint: ApiEndpoints.jur7_responsible
})

const createResponsibleSpravochnik = (config: Partial<SpravochnikHookOptions<Responsible>>) => {
  return extendObject(
    {
      endpoint: ApiEndpoints.jur7_responsible,
      columnDefs: responsibleColumns,
      service: responsibleService,
      filters: [SpravochnikSearchField],
      title: 'Ответственные'
    } satisfies typeof config,
    config
  )
}

export { createResponsibleSpravochnik }
