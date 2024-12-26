import { ApiEndpoints, CRUDService } from '@renderer/common/features/crud'

import { OpenMonthlyReport } from '@renderer/common/models'
import { OpenMonthlyReportValues } from './config'
import { budget } from '@renderer/common/features/crud/middleware'

export const openMonthlyReportService = new CRUDService<OpenMonthlyReport, OpenMonthlyReportValues>(
  {
    endpoint: ApiEndpoints.main_book__doc
  }
).use(budget())
