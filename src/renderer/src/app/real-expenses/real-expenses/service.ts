import type { RealExpenses, Response } from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { budjet, main_schet } from '@/common/features/crud/middleware'
import { http } from '@/common/lib/http'

export const getRealExpenseInfo = async (ctx: QueryFunctionContext) => {
  const response = await http.get<Response<RealExpenses.ReportPreviewInfo>>(
    ApiEndpoints.realcost_report + '/info',
    {
      params: ctx.queryKey[1]
    }
  )
  return response.data
}
export const getRealExpenseById = async (ctx: QueryFunctionContext) => {
  const response = await http.get<Response<RealExpenses.ReportPreviewDetails>>(
    `${ApiEndpoints.realcost_report}/id`,
    { params: ctx.queryKey[2] }
  )
  return response.data
}

export const realExpensesService = new CRUDService<RealExpenses.ReportPreview, any>({
  endpoint: ApiEndpoints.realcost_report
})
  .use(budjet())
  .use(main_schet())
  .forRequest((type, args) => {
    if (type === 'getById') {
      return {
        url: args.endpoint + '/id',
        config: {
          params: args.ctx?.queryKey[2]
        }
      }
    }
    if (type === 'update') {
      return {
        url: args.endpoint,
        config: {
          params: args.payload
        }
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
    return {}
  })
