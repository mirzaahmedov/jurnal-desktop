import { ApiEndpoints, CRUDService } from '@renderer/common/features/crud'

import { Mainbook } from '@renderer/common/models'
import { MainbookReportValues } from './config'
import { budjet } from '@renderer/common/features/crud/middleware'

export const mainbookReportService = new CRUDService<Mainbook.Report, MainbookReportValues>({
  endpoint: ApiEndpoints.mainbook__doc
}).use(budjet())
