import type { Responsible } from '@/common/models'
import type { ResponsiblePayloadType } from './constants'
import type { SpravochnikHookOptions } from '@/common/features/spravochnik'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { responsibleColumns } from './columns'
import { extendObject } from '@/common/lib/utils'

export const responsibleService = new CRUDService<Responsible, ResponsiblePayloadType>({
  endpoint: ApiEndpoints.jur7_responsible
})

const createResponsibleSpravochnik = (config: Partial<SpravochnikHookOptions<Responsible>>) => {
  return extendObject(
    {
      endpoint: ApiEndpoints.jur7_responsible,
      columns: responsibleColumns,
      service: responsibleService,
      title: 'Ответственные'
    } satisfies typeof config,
    config
  )
}

export { createResponsibleSpravochnik }
