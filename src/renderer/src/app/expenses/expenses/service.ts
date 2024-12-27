import { ApiEndpoints, CRUDService } from '@renderer/common/features/crud'
import type { Expenses, Response } from '@renderer/common/models'

import type { QueryFunctionContext } from '@tanstack/react-query'
import { budget } from '@renderer/common/features/crud/middleware'
import { http } from '@renderer/common/lib/http'

export const getExpensesInfo = async (ctx: QueryFunctionContext) => {
  const response = await http.get<Response<Expenses.ReportPreviewProvodka[]>>(
    ApiEndpoints.mainbook__end + '/info',
    {
      params: ctx.queryKey[1]
    }
  )
  return response.data
}
export const getExpensesById = async (ctx: QueryFunctionContext) => {
  const response = await http.get<Response<Expenses.ReportPreviewDetails>>(
    `${ApiEndpoints.mainbook__end}/${ctx.queryKey[1]}`,
    { params: ctx.queryKey[2] }
  )
  return response.data
}

export const expensesService = new CRUDService<Expenses.ReportPreview, any>({
  endpoint: ApiEndpoints.mainbook__end
}).use(budget())
