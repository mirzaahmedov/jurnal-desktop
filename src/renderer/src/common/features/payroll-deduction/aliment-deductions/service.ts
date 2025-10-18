import type { AlimentDeductionFormValues } from './config'
import type { IAliment } from '@/common/models'
import type { AlimentDeduction } from '@/common/models/payroll-deduction'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { zarplataApiNew } from '@/common/lib/zarplata'

export class AlimentDeductionService {
  static endpoint = 'AlimentDeduction'

  static QueryKeys = {
    GetAll: 'AlimentDeduction/all',
    GetById: 'AlimentDeduction/:id',
    GetAliments: 'AlimentDeduction/aliments'
  }

  static async getAll(
    ctx: QueryFunctionContext<
      [typeof AlimentDeductionService.QueryKeys.GetById, { mainId: number }]
    >
  ) {
    const { mainId } = ctx.queryKey[1]
    const res = await zarplataApiNew.get<AlimentDeduction[]>(AlimentDeductionService.endpoint, {
      params: {
        mainId
      }
    })
    return res.data
  }

  static async getById(id: number) {
    const res = await zarplataApiNew.get(`${AlimentDeductionService.endpoint}/${id}`)
    return res.data
  }

  static async create(values: AlimentDeductionFormValues) {
    const res = await zarplataApiNew.post(AlimentDeductionService.endpoint, values)
    return res.data
  }

  static async update(args: { id: number; values: AlimentDeductionFormValues }) {
    const { id, values } = args
    const res = await zarplataApiNew.put(`${AlimentDeductionService.endpoint}/${id}`, values)
    return res.data
  }

  static async delete(id: number) {
    const res = await zarplataApiNew.delete(`${AlimentDeductionService.endpoint}/${id}`)
    return res.data
  }

  static async getAliments(
    ctx: QueryFunctionContext<
      [
        typeof AlimentDeductionService.QueryKeys.GetAliments,
        {
          from: string
          to: string
          spBudnameId: number
        }
      ]
    >
  ) {
    const { from, to, spBudnameId } = ctx.queryKey[1]
    const res = await zarplataApiNew.get<IAliment[]>(
      `${AlimentDeductionService.endpoint}/get-aliment`,
      {
        params: {
          from,
          to,
          spBudnameId
        }
      }
    )
    return res.data
  }
}
