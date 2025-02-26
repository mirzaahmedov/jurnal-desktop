import type {
  SpravochnikHookOptions,
  SpravochnikTableProps
} from '@renderer/common/features/spravochnik'
import type { Response } from '@renderer/common/models'
import type { Ostatok } from '@renderer/common/models/ostatok'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { useMemo } from 'react'

import { GenericTable } from '@renderer/common/components'
import { APIEndpoints, CRUDService } from '@renderer/common/features/crud'
import { budjet, main_schet } from '@renderer/common/features/crud/middleware'
import { SpravochnikSearchField } from '@renderer/common/features/search'
import { http } from '@renderer/common/lib/http'
import { extendObject } from '@renderer/common/lib/utils'
import { z } from 'zod'

import { ostatokSpravochnikColumns } from './columns'

export const OstatokFormSchema = z.object({
  month: z.number(),
  year: z.number()
})
export type OstatokFormValues = z.infer<typeof OstatokFormSchema>

export const ostatokService = new CRUDService<Ostatok, OstatokFormValues>({
  endpoint: APIEndpoints.jur7_saldo,
  getRequestData: {
    getAll: (res: Response<{ responsibles: Ostatok[] }>) => {
      return {
        data: res?.data?.responsibles ?? []
      } as Response<Ostatok[]>
    }
  }
})
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
  .use(main_schet())
  .use(budjet())

const OstatokSpravochnikTable = ({
  data,
  ...props
}: Omit<SpravochnikTableProps<Ostatok>, 'columnDefs'>) => {
  const ostatokData = useMemo(() => {
    return (data as any)?.[0]?.products ?? []
  }, [data])
  // Todo: fix this
  return (
    // @ts-expect-error soehtingz
    <GenericTable
      {...props}
      data={ostatokData}
      columnDefs={ostatokSpravochnikColumns}
    />
  )
}

export const getOstatokCheck = async (
  ctx: QueryFunctionContext<
    [
      string,
      {
        month: number
        year: number
        main_schet_id: number
        budjet_id: number
      }
    ]
  >
) => {
  const { month, year, main_schet_id, budjet_id } = ctx.queryKey[1] ?? {}
  const res = await http.get<Response<Ostatok[]>>(`${APIEndpoints.jur7_saldo}/check`, {
    params: {
      month,
      year,
      main_schet_id,
      budjet_id
    }
  })
  return res.data
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
