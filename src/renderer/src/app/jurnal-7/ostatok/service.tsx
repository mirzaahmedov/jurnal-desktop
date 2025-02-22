import type {
  SpravochnikHookOptions,
  SpravochnikTableProps
} from '@renderer/common/features/spravochnik'
import type { Ostatok, OstatokProduct } from '@renderer/common/models/ostatok'

import { useMemo } from 'react'

import { GenericTable } from '@renderer/common/components'
import { APIEndpoints, CRUDService } from '@renderer/common/features/crud'
import { budjet } from '@renderer/common/features/crud/middleware'
import { SpravochnikSearchField } from '@renderer/common/features/search'
import { extendObject } from '@renderer/common/lib/utils'

import { ostatokSpravochnikColumns } from './columns'

export const ostatokService = new CRUDService<Ostatok>({
  endpoint: APIEndpoints.jur7_saldo
})
  .use(budjet())
  .forRequest((type, ctx) => {
    if (type === 'getById') {
      const { product_id } = ctx.ctx?.queryKey[2] ?? ({} as any)
      return {
        url: ctx.endpoint,
        config: {
          ...ctx.config,
          params: {
            ...ctx.config.params,
            product_id
          }
        }
      }
    }
    return {}
  })

const OstatokSpravochnikTable = ({
  data,
  ...props
}: Omit<SpravochnikTableProps<Ostatok>, 'columnDefs'>) => {
  const ostatokData = useMemo(() => {
    return data?.[0]?.products ?? []
  }, [data])
  return (
    <GenericTable
      {...props}
      data={ostatokData}
      columnDefs={ostatokSpravochnikColumns}
    />
  )
}

export const createOstatokProductSpravochnik = (
  config: Partial<SpravochnikHookOptions<Ostatok>>
) => {
  return extendObject(
    {
      title: 'Выбрать товар',
      endpoint: APIEndpoints.jur7_saldo,
      columnDefs: [],
      CustomTable: OstatokSpravochnikTable,
      service: ostatokService,
      filters: [SpravochnikSearchField]
    } satisfies typeof config,
    config
  )
}
