import { APIEndpoints, CRUDService } from '@renderer/common/features/crud'
import { budjet, main_schet } from '@renderer/common/features/crud/middleware'
import type { RealExpenses } from '@renderer/common/models'

import type { RealExpensesReportValues } from './config'

export const realExpensesReportService = new CRUDService<
  RealExpenses.Report,
  RealExpensesReportValues
>({
  endpoint: APIEndpoints.realcost_doc
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
