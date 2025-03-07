import type { PodotchetMonitor } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'

type PodotchetMonitorMeta = {
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
  summa_object: {
    prixod_sum: number
    rasxod_sum: number
    bank_rasxod_sum: number
    kassa_rasxod_sum: number
    bank_prixod_sum: number
    kassa_prixod_sum: number
    avans_otchet_sum: number
    summa: number
  }
  summa_from_object: {
    prixod_sum: number
    rasxod_sum: number
    bank_rasxod_sum: number
    kassa_rasxod_sum: number
    bank_prixod_sum: number
    kassa_prixod_sum: number
    avans_otchet_sum: number
    summa: number
  }
  summa_to_object: {
    prixod_sum: number
    rasxod_sum: number
    bank_rasxod_sum: number
    kassa_rasxod_sum: number
    bank_prixod_sum: number
    kassa_prixod_sum: number
    avans_otchet_sum: number
    summa: number
  }
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
