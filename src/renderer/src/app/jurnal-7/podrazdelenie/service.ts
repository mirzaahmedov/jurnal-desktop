import type { Jur7Podrazdelenie } from '@/common/models'
import type { Subdivision7PayloadType } from './constants'
import type { SpravochnikHookOptions } from '@/common/features/spravochnik'

import { APIEndpoints, CRUDService } from '@/common/features/crud'
import { extendObject } from '@/common/lib/utils'
import { subdivision7Columns } from './columns'

export const subdivision7Service = new CRUDService<Jur7Podrazdelenie, Subdivision7PayloadType>({
  endpoint: APIEndpoints.jur7_podrazdelenie
})

export const createPodrazdelenie7Spravochnik = (
  config: Partial<SpravochnikHookOptions<Jur7Podrazdelenie>>
) => {
  return extendObject(
    {
      title: 'Выберите подразделение',
      endpoint: APIEndpoints.jur7_podrazdelenie,
      columnDefs: subdivision7Columns,
      service: subdivision7Service
    } satisfies typeof config,
    config
  )
}
