import type {
  OstatokProduct,
  OstatokResponsible,
  Response,
  ResponseMeta
} from '@renderer/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { ApiEndpoints } from '@renderer/common/features/crud'
import { http } from '@renderer/common/lib/http'

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
        products: OstatokProduct[]
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
