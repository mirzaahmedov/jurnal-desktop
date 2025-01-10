import { APIEndpoints, CRUDService } from '@renderer/common/features/crud'
import type { RealExpenses, Response } from '@renderer/common/models'
import { budjet, main_schet } from '@renderer/common/features/crud/middleware'

import type { QueryFunctionContext } from '@tanstack/react-query'
import { http } from '@renderer/common/lib/http'

export const getRealExpenseInfo = async (ctx: QueryFunctionContext) => {
  const response = await http.get<Response<RealExpenses.ReportPreviewInfo>>(
    APIEndpoints.realcost_report + '/info',
    {
      params: ctx.queryKey[1]
    }
  )
  return response.data
}
export const getRealExpenseById = async (ctx: QueryFunctionContext) => {
  const response = await http.get<Response<RealExpenses.ReportPreviewDetails>>(
    `${APIEndpoints.realcost_report}/id`,
    { params: ctx.queryKey[2] }
  )
  return response.data
}

export const realExpensesService = new CRUDService<RealExpenses.ReportPreview, any>({
  endpoint: APIEndpoints.realcost_report
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
