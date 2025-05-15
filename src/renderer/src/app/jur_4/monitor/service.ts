import type { ApiResponseMeta, PodotchetMonitor } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { jur4_schet, main_schet } from '@/common/features/crud/middleware'

interface PodotchetMonitorMeta
  extends Omit<ApiResponseMeta, 'summa_from_object' | 'summa_to_object' | 'summa_object'> {
  page_prixod_sum: number
  page_rasxod_sum: number
  page_total_sum: number
  prixod_sum: number
  rasxod_sum: number
  summa_from: number
  summa_to: number
  total_sum: number
}
export const PodotchetMonitorService = new CRUDService<
  PodotchetMonitor,
  undefined,
  undefined,
  PodotchetMonitorMeta
>({
  endpoint: ApiEndpoints.podotchet_monitoring
})
  .use(main_schet())
  .use(jur4_schet())
