import type { OXReportValues } from './config'
import type { OX } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { budjet, main_schet } from '@/common/features/crud/middleware'

export const oxReportService = new CRUDService<OX.Report, OXReportValues>({
  endpoint: ApiEndpoints.ox_doc
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
