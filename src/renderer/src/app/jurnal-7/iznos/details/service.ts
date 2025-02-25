import type { ostatokQueryKeys } from '@/app/jurnal-7/ostatok'
import type { OstatokProduct, Response } from '@renderer/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { APIEndpoints } from '@renderer/common/features/crud'
import { http } from '@renderer/common/lib/http'

export const getOstatokProducts = async (
  ctx: QueryFunctionContext<
    [
      typeof ostatokQueryKeys.getAll,
      {
        budjet_id: number
        from: string
        to: string
      }
    ]
  >
) => {
  const { budjet_id, from, to } = ctx.queryKey[1]
  const res = await http.get<
    Response<{
      products: OstatokProduct[]
    }>
  >(APIEndpoints.jur7_saldo, {
    params: {
      from,
      to,
      budjet_id,
      iznos: true
    }
  })
  return res.data
}
