import { APIEndpoints, CRUDService } from '@renderer/common/features/crud'
import { budjet, main_schet } from '@renderer/common/features/crud/middleware'
import { Mainbook } from '@renderer/common/models'

import { MainbookReportValues } from './config'

export const mainbookReportService = new CRUDService<Mainbook.Report, MainbookReportValues>({
  endpoint: APIEndpoints.mainbook__doc
})
  .use(budjet())
  .use(main_schet())
  .forRequest((type, args) => {
    if (type === 'update') {
      const { year, month, type_document } = args.payload as any
      return {
        url: args.endpoint,
        config: {
          params: {
            year,
            month,
            type_document
          }
        }
      }
    }
    if (type === 'getById') {
      return {
        url: args.endpoint + '/id',
        config: {
          ...args.config,
          params: args.ctx?.queryKey[2]
        }
      }
    }
    if (type === 'delete') {
      const { year, month, type_document } = (args.payload as any) || {}
      return {
        url: args.endpoint,
        config: {
          params: {
            year,
            month,
            type_document
          }
        }
      }
    }
    return {}
  })
