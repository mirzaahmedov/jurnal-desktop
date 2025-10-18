import type { CalculateParamsFormValues } from './config'
import type { CalculateParams } from '@/common/models/calculate-params'
import type { QueryFunctionContext } from '@tanstack/react-query'

import {
  type ZarplataApiResponse,
  type ZarplataPaginationParams,
  zarplataApiNew
} from '@/common/lib/zarplata'

export class CalculateParamsService {
  static endpoint = 'RegisterMonth'

  static QueryKeys = {
    GetAll: 'calculate-params/all',
    GetById: 'calculate-params/id'
  }

  static async getCalcParameters(
    ctx: QueryFunctionContext<
      [typeof CalculateParamsService.QueryKeys.GetAll, ZarplataPaginationParams]
    >
  ): Promise<ZarplataApiResponse<CalculateParams[]>> {
    const params = ctx.queryKey[1] ?? {}
    const res = await zarplataApiNew.get<ZarplataApiResponse<CalculateParams[]>>(
      `${CalculateParamsService.endpoint}`,
      { params }
    )
    return res.data
  }

  static async getCalcParametersById(
    ctx: QueryFunctionContext<[typeof CalculateParamsService.QueryKeys.GetById, number]>
  ) {
    const id = ctx.queryKey[1] ?? {}
    const res = await zarplataApiNew.get<CalculateParams>(
      `${CalculateParamsService.endpoint}/${id}`
    )
    return res.data
  }

  static async createCalcParameters(
    values: CalculateParamsFormValues
  ): Promise<CalculateParamsFormValues> {
    const res = await zarplataApiNew.post<CalculateParamsFormValues>(
      `${CalculateParamsService.endpoint}`,
      values
    )
    return res.data
  }

  static async updateCalcParameters(args: {
    id: number
    values: CalculateParamsFormValues
  }): Promise<CalculateParamsFormValues> {
    const { id, values } = args
    const res = await zarplataApiNew.put<CalculateParamsFormValues>(
      `${CalculateParamsService.endpoint}/${id}`,
      values
    )
    return res.data
  }

  static async deleteCalcParams(id: number) {
    const res = await zarplataApiNew.delete<CalculateParamsFormValues>(
      `${CalculateParamsService.endpoint}/${id}`
    )
    return res.data
  }

  static async calculateOklad(id: number) {
    const res = await zarplataApiNew.put<{ message: string }>(
      `${CalculateParamsService.endpoint}/calculate-oklad`,
      undefined,
      {
        params: { id }
      }
    )
    return res.data
  }
}
