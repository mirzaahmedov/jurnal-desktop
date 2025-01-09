import type { Jur7Podrazdelenie } from '@/common/models'
import type { Subdivision7PayloadType } from './constants'
import type { SpravochnikHookOptions } from '@/common/features/spravochnik'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { extendObject } from '@/common/lib/utils'
import { subdivision7Columns } from './columns'

export const subdivision7Service = new CRUDService<Jur7Podrazdelenie, Subdivision7PayloadType>({
  endpoint: ApiEndpoints.jur7_podrazdelenie
})

export const createPodrazdelenie7Spravochnik = (
  config: Partial<SpravochnikHookOptions<Jur7Podrazdelenie>>
) => {
  return extendObject(
    {
      title: 'Выберите подразделение',
      endpoint: ApiEndpoints.jur7_podrazdelenie,
      columns: subdivision7Columns,
      service: subdivision7Service
    } satisfies typeof config,
    config
  )
}
