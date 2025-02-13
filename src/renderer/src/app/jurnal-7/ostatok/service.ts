import type { OstatokProduct } from '@renderer/common/models/ostatok'

import { APIEndpoints, CRUDService } from '@renderer/common/features/crud'
import { budjet } from '@renderer/common/features/crud/middleware'
import { SpravochnikSearchField } from '@renderer/common/features/search'
import type { SpravochnikHookOptions } from '@renderer/common/features/spravochnik'
import { extendObject } from '@renderer/common/lib/utils'

import { ostatokProductColumns } from './columns'

export const ostatokService = new CRUDService<
  OstatokProduct,
  {
    year: number
    month: number
  }
>({
  endpoint: APIEndpoints.jur7_saldo_product
}).use(budjet())

export const ostatokProductService = new CRUDService<OstatokProduct>({
  endpoint: APIEndpoints.jur7_saldo_product
}).forRequest((type, args) => {
  if (type === 'getById') {
    return {
      url: args.endpoint
    }
  }
  return {}
})

export const createOstatokProductSpravochnik = (
  config: Partial<SpravochnikHookOptions<OstatokProduct>>
) => {
  return extendObject(
    {
      title: 'Выбрать товар',
      endpoint: APIEndpoints.jur7_saldo_product,
      columnDefs: ostatokProductColumns,
      service: ostatokProductService,
      filters: [SpravochnikSearchField]
    } satisfies typeof config,
    config
  )
}
