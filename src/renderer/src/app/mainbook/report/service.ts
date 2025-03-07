import type { MainbookReportValues } from './config'
import type { Mainbook, Response } from '@renderer/common/models'

import { ApiEndpoints, CRUDService } from '@renderer/common/features/crud'
import { budjet, main_schet } from '@renderer/common/features/crud/middleware'
import { http } from '@renderer/common/lib/http'

export const mainbookReportService = new CRUDService<Mainbook.Report, MainbookReportValues>({
  endpoint: ApiEndpoints.mainbook__doc
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

export interface AutofillMainbookReportQueryParams {
  year: number
  month: number
  type_document: string
}
export const autofillMainbookReportQuery = async ({
  year,
  month,
  type_document
}: AutofillMainbookReportQueryParams) => {
  const res = await http.get<Response<Mainbook.Autofill[]>>('/main/book/doc/auto', {
    params: {
      year,
      month,
      type_document
    }
  })
  return res.data
}
