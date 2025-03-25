import type { PodotchetMonitor, ResponseMeta } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'

type PodotchetMonitorMeta = ResponseMeta & {
  pageCount: number
  count: number
  currentPage: number
  nextPage: any
  backPage: any
  summa_from: number
  summa_to: number
  page_prixod_sum: number
  page_rasxod_sum: number
  page_total_sum: number
  prixod_sum: number
  rasxod_sum: number
  summa: number
}

const podotchetMonitoringService = new CRUDService<
  PodotchetMonitor,
  undefined,
  undefined,
  PodotchetMonitorMeta
>({
  endpoint: ApiEndpoints.podotchet_monitoring
})

export { podotchetMonitoringService }
