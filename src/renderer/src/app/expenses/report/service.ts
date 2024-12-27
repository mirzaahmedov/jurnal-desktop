import { ApiEndpoints, CRUDService } from '@renderer/common/features/crud'

import { Mainbook } from '@renderer/common/models'
import { MainbookReportValues } from './config'
import { budget } from '@renderer/common/features/crud/middleware'

export const openMonthlyReportService = new CRUDService<Mainbook.Report, MainbookReportValues>({
  endpoint: ApiEndpoints.mainbook__doc
}).use(budget())
