import type { Jur7Monitoring } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'

export const Jur7MonitorService = new CRUDService<Jur7Monitoring>({
  endpoint: ApiEndpoints.jur7_monitoring
})
