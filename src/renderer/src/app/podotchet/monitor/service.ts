import type { PodotchetMonitor, ResponseMeta, Response } from '@/common/models'

import { http } from '@/common/lib/http'
import { CRUDService, ApiEndpoints, GetAllQueryKey } from '@/common/features/crud'
import { QueryFunctionContext } from '@tanstack/react-query'

type PodotchetMonitorMeta = ResponseMeta & {
  summa_prixod: number
  summa_rasxod: number
  summa_from: number
  summa_to: number
}

const podotchetMonitoringService = new CRUDService<
  PodotchetMonitor,
  undefined,
  undefined,
  PodotchetMonitorMeta
>({
  endpoint: ApiEndpoints.podotchet_monitoring
})

const getPodotchetMonitoringByIdQuery = async (ctx: QueryFunctionContext<GetAllQueryKey>) => {
  const params = ctx.queryKey[1]
  const id = ctx.queryKey[2]
  const res = await http.get<Response<PodotchetMonitor[], PodotchetMonitorMeta>>(
    '/podotchet/monitoring/' + id,
    {
      params
    }
  )
  return res.data
}

export { podotchetMonitoringService, getPodotchetMonitoringByIdQuery }
