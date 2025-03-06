import type {
  SpravochnikHookOptions,
  SpravochnikTableProps
} from '@renderer/common/features/spravochnik'
import type { Response, ResponseMeta } from '@renderer/common/models'
import type { OstatokGroup } from '@renderer/common/models/ostatok'
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

export enum OstatokViewOption {
  PRODUCT = 'product',
  RESPONSIBLE = 'responsible',
  GROUP = 'group'
}

export const OstatokFormSchema = z.object({
  month: z.number(),
  year: z.number()
})
export type OstatokFormValues = z.infer<typeof OstatokFormSchema>

export const ostatokService = new CRUDService<OstatokGroup, OstatokFormValues>({
  endpoint: APIEndpoints.jur7_saldo
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
}: Omit<SpravochnikTableProps<OstatokGroup>, 'columnDefs'>) => {
  const ostatokData = useMemo(() => {
    return (data as any)?.[0]?.products ?? []
  }, [data])
  // Todo: fix this
  return (
    // @ts-expect-error fix this later
    <GenericTable
      {...props}
      data={ostatokData}
      columnDefs={ostatokSpravochnikColumns}
      getRowId={(row) => row.naimenovanie_tovarov_jur7_id}
    />
  )
}

export const getOstatokListQuery = async (
  ctx: QueryFunctionContext<
    [
      string,
      {
        search?: string
        kimning_buynida?: number
        group_id?: number
        budjet_id: number
        to: string
        page: number
        limit: number
        iznos?: boolean
      }
    ]
  >
) => {
  const { search, kimning_buynida, budjet_id, to, page, limit, iznos } = ctx.queryKey[1] ?? {}
  const res = await http.get<Response<OstatokGroup[], ResponseMeta>>(`${APIEndpoints.jur7_saldo}`, {
    params: {
      search,
      kimning_buynida,
      budjet_id,
      to,
      page,
      limit,
      iznos
    }
  })
  return res.data
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
  const res = await http.get<Response<OstatokGroup[]>>(`${APIEndpoints.jur7_saldo}/check`, {
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
  config: Partial<SpravochnikHookOptions<OstatokGroup>>
) => {
  return extendObject(
    {
      title: 'Выбрать товар',
      endpoint: APIEndpoints.jur7_saldo,
      columnDefs: [],
      CustomTable: OstatokSpravochnikTable,
      // TODO: fix this issue
      // getRowId: ((row: OstatokProduct) => row.naimenovanie_tovarov_jur7_id) as any,
      // TODO: fix this issue
      service: ostatokService as any,
      filters: [SpravochnikSearchField]
    } satisfies typeof config,
    config
  )
}
