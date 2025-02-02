import type { OXReportValues } from './config'
import type { OX } from '@renderer/common/models'

import { APIEndpoints, CRUDService } from '@renderer/common/features/crud'
import { budjet, main_schet } from '@renderer/common/features/crud/middleware'

export const oxReportService = new CRUDService<OX.Report, OXReportValues>({
  endpoint: APIEndpoints.ox_doc
})
  .use(budjet())
  .use(main_schet())
  .forRequest((type, args) => {
    if (type === 'getById') {
      return {
        url: args.endpoint + '/id',
        params: args.ctx?.queryKey[2]
      }
    }
    if (type === 'update') {
      const { year, month } = args.payload as any
      return {
        url: args.endpoint,
        config: {
          params: {
            year,
            month
          }
        }
      }
    }
    if (type === 'delete') {
      const { year, month } = (args.payload as any) || {}
      return {
        url: args.endpoint,
        config: {
          params: {
            year,
            month
          }
        }
      }
    }
    return {}
  })
