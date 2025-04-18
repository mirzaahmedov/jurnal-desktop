import type { OstatokResponsible, Response, ResponseMeta, SaldoProduct } from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { ApiEndpoints } from '@/common/features/crud'
import { http } from '@/common/lib/http'

export const getAdminOstatokListQuery = async (
  ctx: QueryFunctionContext<
    [
      string,
      {
        search?: string
        kimning_buynida?: number
        responsible: boolean
        to: string
        page: number
        limit: number
      }
    ]
  >
) => {
  const { search, kimning_buynida, responsible, to, page, limit } = ctx.queryKey[1] ?? {}
  const res = await http.get<
    Response<
      {
        responsibles: OstatokResponsible[]
        products: SaldoProduct[]
      },
      ResponseMeta
    >
  >(`${ApiEndpoints.admin__saldo}`, {
    params: {
      search,
      kimning_buynida,
      responsible,
      to,
      page: responsible ? undefined : page,
      limit: responsible ? undefined : limit
    }
  })
  return res.data
}
