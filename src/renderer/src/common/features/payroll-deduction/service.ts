import type { PayrollDeductionChangePaymentFormValues, PayrollDeductionFormValues } from './config'
import type { PayrollDeduction } from '@/common/models/payroll-deduction'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { type ZarplataApiResponse, zarplataApiNew } from '@/common/lib/zarplata_new'

export class PayrollDeductionService {
  static endpoint = 'PayrollDeduction'

  static QueryKeys = {
    GetByMainZarplataId: 'PayrollDeduction/GetByMainZarplataId',
    GetById: 'PayrollDeduction/GetById',
    Create: 'PayrollDeduction/Create',
    Update: 'PayrollDeduction/Update',
    Delete: 'PayrollDeduction/Delete'
  }

  static async changePayment(args: {
    isXarbiy: boolean | undefined
    values: PayrollDeductionChangePaymentFormValues
  }) {
    const { isXarbiy, values } = args
    const res = await zarplataApiNew.put(
      `${PayrollDeductionService.endpoint}/change-payments`,
      values,
      {
        params: {
          isXarbiy
        }
      }
    )
    return res.data
  }

  static async getByMainZarplataId(
    ctx: QueryFunctionContext<
      [typeof PayrollDeductionService.QueryKeys.GetByMainZarplataId, number]
    >
  ) {
    const mainZarplataId = ctx.queryKey[1]
    const res = await zarplataApiNew.get<ZarplataApiResponse<PayrollDeduction[]>>(
      PayrollDeductionService.endpoint,
      {
        params: {
          mainZarplataId
        }
      }
    )
    return res.data
  }

  static async create(values: PayrollDeductionFormValues) {
    const res = await zarplataApiNew.post<PayrollDeduction>(
      PayrollDeductionService.endpoint,
      values
    )
    return res.data
  }

  static async update(args: { id: number; values: PayrollDeductionFormValues }) {
    const { id, values } = args
    const res = await zarplataApiNew.put<PayrollDeduction>(
      `${PayrollDeductionService.endpoint}/${id}`,
      values
    )
    return res.data
  }

  static async delete(id: number) {
    const res = await zarplataApiNew.delete<PayrollDeduction>(
      `${PayrollDeductionService.endpoint}/${id}`
    )
    return res.data
  }
}
