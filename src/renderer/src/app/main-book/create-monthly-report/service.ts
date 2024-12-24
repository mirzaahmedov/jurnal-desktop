import { ApiEndpoints } from '@renderer/common/features/crud'
import { CreateMonthlyReportForm } from './config'
import { QueryFunctionContext } from '@tanstack/react-query'
import { Response } from '@renderer/common/models'
import { http } from '@renderer/common/lib/http'

interface CreateMonthlyReportIdentity {
  main_schet_id: number
  year: number
  month: number
  type_document: string
}

export const createMonthlyReportGetAllQuery = async (
  ctx: QueryFunctionContext<[string, Pick<CreateMonthlyReportIdentity, 'main_schet_id'>]>
) => {
  const params = ctx.queryKey[1]
  const res = await http.get(ApiEndpoints.main_book__doc, { params })
  return res.data
}

export const createMonthlyReportDeleteQuery = async (params: CreateMonthlyReportIdentity) => {
  const res = await http.delete(`${ApiEndpoints.main_book__doc}`, { params })
  return res.data
}

export const createMonthlyReportCreateQuery = async ({
  main_schet_id,
  ...values
}: CreateMonthlyReportForm & { main_schet_id: number }) => {
  const res = await http.post(ApiEndpoints.main_book__doc, values, { params: { main_schet_id } })
  return res.data
}

export const createMonthlyReportUpdateQuery = async ({
  main_schet_id,
  ...values
}: CreateMonthlyReportForm & { main_schet_id: number }) => {
  const res = await http.put(ApiEndpoints.main_book__doc, values, { params: { main_schet_id } })
  return res.data
}

export const createMonthlyReportGetByIdQuery = async (
  ctx: QueryFunctionContext<[string, CreateMonthlyReportIdentity]>
) => {
  const params = ctx.queryKey[1]
  const res = await http.get<Response<CreateMonthlyReportForm>>(
    ApiEndpoints.main_book__doc + '/id',
    {
      params
    }
  )
  return res.data
}
