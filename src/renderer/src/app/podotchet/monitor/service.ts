import { APIEndpoints, CRUDService } from '@/common/features/crud'
import type { PodotchetMonitor, ResponseMeta } from '@/common/models'

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
  endpoint: APIEndpoints.podotchet_monitoring
})

export { podotchetMonitoringService }
