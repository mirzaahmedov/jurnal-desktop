import type { JUR8Monitor } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { budjet } from '@/common/features/crud/middleware'

export const Jur8MonitorService = new CRUDService<JUR8Monitor>({
  endpoint: ApiEndpoints.jur8_monitoring
}).use(budjet())
