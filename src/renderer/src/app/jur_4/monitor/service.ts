import type { PodotchetMonitor, ResponseMeta } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { jur4_schet, main_schet } from '@/common/features/crud/middleware'

interface SummaObject {
  summa: number
  prixod_sum: number
  rasxod_sum: number
  kursatilgan_hizmatlar_sum_prixod: number
  bank_rasxod_sum_prixod: number
  bajarilgan_ishlar_sum_rasxod: number
  bank_prixod_sum_rasxod: number
  jur7_prixod_sum_rasxod: number
}

interface PodotchetMonitorMeta
  extends Omit<ResponseMeta, 'summa_from_object' | 'summa_to_object' | 'summa_object'> {
  page_prixod_sum: number
  page_rasxod_sum: number
  page_total_sum: number
  summa_from_object: SummaObject
  summa_from: number
  summa_to_object: SummaObject
  summa_to: number
  prixod_sum: number
  rasxod_sum: number
  summa_object: SummaObject
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
