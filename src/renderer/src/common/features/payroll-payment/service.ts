import type { PayrollPaymentFormValues } from './config'
import type { PayrollPayment } from '@/common/models/payroll-payment'

import { zarplataApiNew } from '@/common/lib/zarplata_new'

export class PayrollPaymentService {
  static endpoint = 'PayrollPayment'

  static QueryKeys = {
    GetAll: 'PayrollPayment.GetAll',
    GetById: 'PayrollPayment.GetById',
    Create: 'PayrollPayment.Create',
    Update: 'PayrollPayment.Update',
    Delete: 'PayrollPayment.Delete'
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
