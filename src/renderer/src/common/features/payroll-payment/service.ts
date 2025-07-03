import type { PayrollPaymentFormValues } from './config'
import type { PayrollPayment } from '@/common/models/payroll-payment'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { type ZarplataApiResponse, zarplataApiNew } from '@/common/lib/zarplata_new'

export class PayrollPaymentService {
  static endpoint = 'PayrollPayment'

  static QueryKeys = {
    GetByMainZarplataId: 'PayrollPayment/GetByMainZarplataId',
    GetById: 'PayrollPayment/GetById',
    Create: 'PayrollPayment/Create',
    Update: 'PayrollPayment/Update',
    Delete: 'PayrollPayment/Delete'
  }

  static async getByMainZarplataId(
    ctx: QueryFunctionContext<[typeof PayrollPaymentService.QueryKeys.GetByMainZarplataId, number]>
  ) {
    const mainZarplataId = ctx.queryKey[1]
    const res = await zarplataApiNew.get<ZarplataApiResponse<PayrollPayment[]>>(
      PayrollPaymentService.endpoint,
      {
        params: {
          mainZarplataId
        }
      }
    )
    return res.data
  }

  static async create(values: PayrollPaymentFormValues) {
    const res = await zarplataApiNew.post<PayrollPayment>(PayrollPaymentService.endpoint, values)
    return res.data
  }

  static async update(args: { id: number; values: PayrollPaymentFormValues }) {
    const { id, values } = args
    const res = await zarplataApiNew.put<PayrollPayment>(
      `${PayrollPaymentService.endpoint}/${id}`,
      values
    )
    return res.data
  }

  static async delete(id: number) {
    const res = await zarplataApiNew.delete<PayrollPayment>(
      `${PayrollPaymentService.endpoint}/${id}`
    )
    return res.data
  }
}
