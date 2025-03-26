import type { Subdivision7PayloadType } from './constants'
import type { SpravochnikHookOptions } from '@/common/features/spravochnik'
import type { Jur7Podrazdelenie } from '@/common/models'

import { SpravochnikSearchField } from '@renderer/common/features/search/spravochnik-search-field'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { extendObject } from '@/common/lib/utils'

import { podrazdelenieColumns } from './columns'

export const podrazdelenieService = new CRUDService<Jur7Podrazdelenie, Subdivision7PayloadType>({
  endpoint: ApiEndpoints.jur7_podrazdelenie
})

export const createPodrazdelenie7Spravochnik = (
  config: Partial<SpravochnikHookOptions<Jur7Podrazdelenie>>
) => {
  return extendObject(
    {
      title: 'Выберите подразделение',
      endpoint: ApiEndpoints.jur7_podrazdelenie,
      columnDefs: podrazdelenieColumns,
      filters: [SpravochnikSearchField],
      service: podrazdelenieService
    } satisfies typeof config,
    config
  )
}
