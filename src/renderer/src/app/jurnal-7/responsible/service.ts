import type { ResponsibleFormValues } from './constants'
import type { SpravochnikHookOptions } from '@/common/features/spravochnik'
import type { Responsible } from '@/common/models'

import { SpravochnikSearchField } from '@renderer/common/features/search'

import { APIEndpoints, CRUDService } from '@/common/features/crud'
import { extendObject } from '@/common/lib/utils'

import { responsibleColumns } from './columns'

export const responsibleService = new CRUDService<Responsible, ResponsibleFormValues>({
  endpoint: APIEndpoints.jur7_responsible
})

const createResponsibleSpravochnik = (config: Partial<SpravochnikHookOptions<Responsible>>) => {
  return extendObject(
    {
      endpoint: APIEndpoints.jur7_responsible,
      columnDefs: responsibleColumns,
      service: responsibleService,
      filters: [SpravochnikSearchField],
      title: 'Ответственные'
    } satisfies typeof config,
    config
  )
}

export { createResponsibleSpravochnik }
