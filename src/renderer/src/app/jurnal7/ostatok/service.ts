import { APIEndpoints, CRUDService } from '@renderer/common/features/crud'
import { SpravochnikSearchField } from '@renderer/common/features/search'
import { SpravochnikHookOptions } from '@renderer/common/features/spravochnik'
import { extendObject } from '@renderer/common/lib/utils'

import type { Ostatok } from '@renderer/common/models/ostatok'
import { ostatokProductColumns } from './columns'
import { formatDate } from '@renderer/common/lib/date'

export const ostatokService = new CRUDService<
  Ostatok,
  {
    year: number
    month: number
  }
>({
  endpoint: APIEndpoints.jur7_saldo
})

export const ostatokProductService = new CRUDService<Ostatok>({
  endpoint: APIEndpoints.jur7_saldo_product
}).forRequest((type, args) => {
  if (type === 'getById') {
    return {
      url: args.endpoint,
      config: {
        params: {
          ...args.config.params,
          to: formatDate(new Date()),
          product_id: args.ctx?.queryKey[1]
        }
      }
    }
  }
  return {}
})

export const createOstatokProductSpravochnik = (
  config: Partial<SpravochnikHookOptions<Ostatok>>
) => {
  return extendObject(
    {
      title: 'Выберите операцию',
      endpoint: APIEndpoints.jur7_saldo_product,
      columns: ostatokProductColumns,
      service: ostatokProductService,
      filters: [SpravochnikSearchField]
    } satisfies typeof config,
    config
  )
}
