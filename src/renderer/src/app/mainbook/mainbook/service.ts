import type { Mainbook, Response } from '@renderer/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { ApiEndpoints, CRUDService } from '@renderer/common/features/crud'
import { budjet, main_schet } from '@renderer/common/features/crud/middleware'
import { http } from '@renderer/common/lib/http'

export const getMainbookInfo = async (ctx: QueryFunctionContext) => {
  const response = await http.get<Response<Mainbook.ReportPreviewInfo>>(
    ApiEndpoints.mainbook__report + '/info',
    {
      params: ctx.queryKey[1]
    }
  )
  return response.data
}
export const getMainbookById = async (ctx: QueryFunctionContext) => {
  const response = await http.get<Response<Mainbook.ReportPreviewDetails>>(
    `${ApiEndpoints.mainbook__report}/id`,
    { params: ctx.queryKey[2] }
  )
  return response.data
}

export const mainbookService = new CRUDService<Mainbook.ReportPreview, any>({
  endpoint: ApiEndpoints.mainbook__report
})
  .use(budjet())
  .use(main_schet())
  .forRequest((type, args) => {
    if (type === 'update') {
      return {
        url: args.endpoint,
        config: {
          params: {
            ...args.config.params,
            ...(args.payload as any)
          }
        }
      }
    }
    return {}
  })
