import type { RealExpensesReportValues } from './config'
import type { RealExpenses } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { budjet, main_schet } from '@/common/features/crud/middleware'

export const realExpensesReportService = new CRUDService<
  RealExpenses.Report,
  RealExpensesReportValues
>({
  endpoint: ApiEndpoints.realcost_doc
})
  .use(budjet())
  .use(main_schet())
  .forRequest((type, args) => {
    if (type === 'getById') {
      return {
        url: args.endpoint + '/id'
      }
    }
    if (type === 'delete') {
      return {
        url: args.endpoint,
        config: {
          params: args.payload
        }
      }
    }
    if (type === 'update') {
      const { month, year, type_document } = args.payload as any
      return {
        url: args.endpoint,
        config: {
          params: {
            month,
            year,
            type_document
          }
        }
      }
    }
    return {}
  })
