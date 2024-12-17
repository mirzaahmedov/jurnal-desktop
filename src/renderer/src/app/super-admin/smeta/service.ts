import type { Smeta } from '@/common/models'
import type { SpravochnikHookOptions } from '@/common/features/spravochnik'
import type { SmetaForm } from './config'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { extendObject } from '@/common/lib/utils'
import { smetaColumns } from './columns'
import { SpravochnikSearchField } from '@/common/features/search'

export const smetaService = new CRUDService<Smeta, SmetaForm>({
  endpoint: ApiEndpoints.smeta
})

export const createSmetaSpravochnik = (config: Partial<SpravochnikHookOptions<Smeta>>) => {
  return extendObject(
    {
      title: 'Выберите смету',
      endpoint: ApiEndpoints.smeta,
      columns: smetaColumns,
      service: smetaService,
      filters: [SpravochnikSearchField],
      paginate: false
    } satisfies typeof config,
    config
  )
}
