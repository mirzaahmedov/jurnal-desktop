import { ApiEndpoints, CRUDService } from '@renderer/common/features/crud'

import { Expenses } from '@renderer/common/models'
import { ExpensesReportValues } from './config'
import { budget } from '@renderer/common/features/crud/middleware'

export const expensesReportService = new CRUDService<Expenses.Report, ExpensesReportValues>({
  endpoint: ApiEndpoints.mainbook__doc
}).use(budget())
