import type { OX, Response } from '@renderer/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { ApiEndpoints, CRUDService } from '@renderer/common/features/crud'
import { budjet, main_schet } from '@renderer/common/features/crud/middleware'
import { http } from '@renderer/common/lib/http'

export const getOXInfo = async (ctx: QueryFunctionContext) => {
  const response = await http.get<Response<OX.ReportPreviewDetails>>(
    ApiEndpoints.ox_report + '/info',
    {
      params: ctx.queryKey[1]
    }
  )
  return response.data
}
export const getOXById = async (ctx: QueryFunctionContext) => {
  const response = await http.get<Response<OX.ReportPreviewDetails>>(
    `${ApiEndpoints.ox_report}/id`,
    { params: ctx.queryKey[2] }
  )
  return response.data
}

export const oxService = new CRUDService<OX.ReportPreview, any>({
  endpoint: ApiEndpoints.ox_report
})
  .use(budjet())
  .use(main_schet())
  .forRequest((type, args) => {
    if (type === 'delete') {
      return {
        url: args.endpoint,
        config: {
          params: args.payload
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
    return {}
  })
