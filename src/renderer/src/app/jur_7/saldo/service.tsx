import type { MonthValue } from '@/common/features/saldo'
import type { OstatokProduct, Response } from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { budjet } from '@/common/features/crud/middleware'
import { http } from '@/common/lib/http'

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

// Todo: remove this service
export const ostatokService = new CRUDService<never, OstatokFormValues>({
  endpoint: ApiEndpoints.jur7_saldo
}).use(budjet())

export const ostatokProductService = new CRUDService<OstatokProduct>({
  endpoint: ApiEndpoints.saldo_product
}).use(budjet())

export interface DeleteOstatokArgs {
  ids: Array<{
    id: number
  }>
  year: number
  month: number
  budjet_id: number
}
export const deleteOstatokBatchQuery = async ({
  ids,
  year,
  month,
  budjet_id
}: DeleteOstatokArgs) => {
  const res = await http.delete(ApiEndpoints.jur7_saldo, {
    data: {
      ids,
      year,
      month
    },
    params: {
      budjet_id
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
        budjet_id: number
      },
      string
    ]
  >
) => {
  const { month, year, budjet_id } = ctx.queryKey[1] ?? {}
  const res = await http.get<Response<unknown[]>>(`${ApiEndpoints.jur7_saldo}/check`, {
    params: {
      month,
      year,
      budjet_id
    }
  })
  return res.data
}

export const getMonthlySaldoQuery = async (
  ctx: QueryFunctionContext<
    [
      string,
      {
        year: number
        budjet_id: number
      }
    ]
  >
) => {
  const { year, budjet_id } = ctx.queryKey[1] ?? {}
  const res = await http.get<Response<MonthValue[]>>('/jur_7/monitoring/saldo/date', {
    params: {
      year,
      budjet_id
    }
  })
  return res.data
}

export const cleanSaldo = async (values: { budjet_id: number; password: string }) => {
  const { budjet_id, password } = values
  const res = await http.delete<Response<unknown>>(`${ApiEndpoints.jur7_saldo}/clean`, {
    params: {
      budjet_id,
      password
    }
  })
  return res.data
}
