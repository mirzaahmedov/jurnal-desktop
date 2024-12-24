import type { CloseMonthlyReportDetails, Response } from '@renderer/common/models'

import { ApiEndpoints } from '@renderer/common/features/crud'
import type { QueryFunctionContext } from '@tanstack/react-query'
import { http } from '@renderer/common/lib/http'

export const getCloseMonthlyReportInfo = async (
  ctx: QueryFunctionContext<[string, { year: number; month: number; main_schet_id: number }]>
) => {
  const response = await http.get<Response<CloseMonthlyReportDetails[]>>(
    ApiEndpoints.main_book__end + '/info',
    {
      params: ctx.queryKey[1]
    }
  )
  return response.data
}

export const getCloseMonthlyReportList = async (
  ctx: QueryFunctionContext<[string, { main_schet_id: number }]>
) => {
  const response = await http.get<Response<any[]>>(ApiEndpoints.main_book__end, {
    params: ctx.queryKey[1]
  })
  console.log({ data: response.data })
  return response.data
}

export const createCloseMonthlyReport = async ({
  main_schet_id,
  data,
  month,
  year
}: {
  main_schet_id: number
  data: CloseMonthlyReportDetails[]
  month: number
  year: number
}) => {
  const response = await http.post<string>(
    ApiEndpoints.main_book__end,
    {
      month,
      year,
      data
    },
    {
      params: {
        main_schet_id
      }
    }
  )
  return response.data
}

export const updateCloseMonthlyReport = async ({
  main_schet_id,
  data,
  month,
  year
}: {
  main_schet_id: number
  data: CloseMonthlyReportDetails[]
  month: number
  year: number
}) => {
  const response = await http.put<string>(
    ApiEndpoints.main_book__end,
    {
      month,
      year,
      data
    },
    {
      params: {
        main_schet_id
      }
    }
  )
  return response.data
}

export const deleteCloseMonthlyReport = async (params: {
  main_schet_id: number
  year: number
  month: number
}) => {
  const response = await http.delete<string>(ApiEndpoints.main_book__end + '/', {
    params
  })
  return response.data
}
