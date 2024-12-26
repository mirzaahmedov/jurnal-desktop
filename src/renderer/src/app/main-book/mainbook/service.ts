import { ApiEndpoints, CRUDService } from '@renderer/common/features/crud'
import type { Mainbook, Response } from '@renderer/common/models'

import type { QueryFunctionContext } from '@tanstack/react-query'
import { budget } from '@renderer/common/features/crud/middleware'
import { http } from '@renderer/common/lib/http'

export const getMainbookInfo = async (ctx: QueryFunctionContext) => {
  const response = await http.get<Response<Mainbook.ReportPreviewProvodka[]>>(
    ApiEndpoints.main_book__end + '/info',
    {
      params: ctx.queryKey[1]
    }
  )
  return response.data
}
export const getMainbookById = async (ctx: QueryFunctionContext) => {
  const response = await http.get<Response<Mainbook.ReportPreviewDetails>>(
    `${ApiEndpoints.main_book__end}/${ctx.queryKey[1]}`,
    { params: ctx.queryKey[2] }
  )
  return response.data
}

export const mainbookService = new CRUDService<Mainbook.ReportPreview, any>({
  endpoint: ApiEndpoints.main_book__end
}).use(budget())
