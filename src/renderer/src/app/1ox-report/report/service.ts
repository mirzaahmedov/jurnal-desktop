import { ApiEndpoints, CRUDService } from '@renderer/common/features/crud'

import type { OX } from '@renderer/common/models'
import type { OXReportValues } from './config'
import { budjet } from '@renderer/common/features/crud/middleware'

export const oxReportService = new CRUDService<OX.Report, OXReportValues>({
  endpoint: ApiEndpoints.ox
}).use(budjet())
