import type { AlimentDeductionFormValues } from './config'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { http } from '@/common/lib/http'

export class AlimentDeductionService {
  static endpoint = 'AlimentDeduction'

  static QueryKeys = {
    GetAll: 'AlimentDeduction/all',
    GetById: 'AlimentDeduction/:id'
  }

  static async getAll(
    ctx: QueryFunctionContext<
      [typeof AlimentDeductionService.QueryKeys.GetById, { mainId: number }]
    >
  ) {
    const { mainId } = ctx.queryKey[1]
    const res = await http.get(AlimentDeductionService.endpoint, {
      params: {
        mainId
      }
    })
    return res.data
  }

  static async getById(id: number) {
    const res = await http.get(`${AlimentDeductionService.endpoint}/${id}`)
    return res.data
  }

  static async create(values: AlimentDeductionFormValues) {
    const res = await http.post(AlimentDeductionService.endpoint, values)
    return res.data
  }

  static async update(args: { id: number; values: AlimentDeductionFormValues }) {
    const { id, values } = args
    const res = await http.put(`${AlimentDeductionService.endpoint}/${id}`, values)
    return res.data
  }

  static async delete(id: number) {
    const res = await http.delete(`${AlimentDeductionService.endpoint}/${id}`)
    return res.data
  }
}
