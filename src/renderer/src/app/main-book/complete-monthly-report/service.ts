import { ApiEndpoints, CRUDService } from '@renderer/common/features/crud'
import type {
  CompleteMonthlyReport,
  CompleteMonthlyReportProvodka,
  CompleteMonthlyReportProvodkaData,
  Response
} from '@renderer/common/models'

import type { QueryFunctionContext } from '@tanstack/react-query'
import { budget } from '@renderer/common/features/crud/middleware'
import { http } from '@renderer/common/lib/http'

export const getCompleteMonthlyReportInfo = async (ctx: QueryFunctionContext) => {
  const response = await http.get<Response<CompleteMonthlyReportProvodkaData[]>>(
    ApiEndpoints.main_book__end + '/info',
    {
      params: ctx.queryKey[1]
    }
  )
  return response.data
}

export const getCompleteMonthlyReportById = async (ctx: QueryFunctionContext) => {
  const response = await http.get<Response<CompleteMonthlyReportProvodka>>(
    `${ApiEndpoints.main_book__end}/${ctx.queryKey[1]}`,
    { params: ctx.queryKey[2] }
  )
  return response.data
}

export const completeMonthlyReportService = new CRUDService<CompleteMonthlyReport, any>({
  endpoint: ApiEndpoints.main_book__end
}).use(budget())
