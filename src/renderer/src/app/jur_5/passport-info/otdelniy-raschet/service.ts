import type { OtdelniyRaschetFormValues } from './config'
import type { OtdelniyRaschetPaymentFormValues } from './otdelniy-raschet-payments-dialog'
import type { OtdelniyRaschet } from '@/common/models/otdelniy-raschet'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { zarplataApiNew } from '@/common/lib/zarplata'

export class OtdelniyRaschetService {
  static endpoint = 'OtdelniyRaschet'

  static QueryKeys = {
    GetById: 'OtdelniyRaschet/get-by-id',
    GetByMonthly: 'OtdelniyRaschet/get-by-monthly',
    GetByMainZarplataId: 'OtdelniyRaschet/get-by-mainId'
  }

  static async getByMainZarplataId({
    mainZarplataId,
    from,
    to
  }: {
    mainZarplataId: number
    from: string
    to: string
  }) {
    const res = await zarplataApiNew.get<OtdelniyRaschet[]>(
      `${OtdelniyRaschetService.endpoint}/${mainZarplataId}`,
      {
        params: {
          from,
          to
        }
      }
    )
    return res.data
  }

  static async getAll(
    ctx: QueryFunctionContext<
      [
        typeof OtdelniyRaschetService.QueryKeys.GetByMainZarplataId,
        number,
        {
          from: string
          to: string
        }
      ]
    >
  ) {
    const mainZarplataId = ctx.queryKey[1]
    const { from, to } = ctx.queryKey[2]
    const res = await zarplataApiNew.get<OtdelniyRaschet[]>(
      `${OtdelniyRaschetService.endpoint}/${mainZarplataId}?from=${from}&to=${to}`
    )
    return res.data
  }

  static async getById(id: number) {
    const res = await zarplataApiNew.get<OtdelniyRaschet>(
      `${OtdelniyRaschetService.endpoint}/getById/${id}`
    )
    return res.data
  }

  static async create(values: OtdelniyRaschetFormValues) {
    const res = await zarplataApiNew.post(`${OtdelniyRaschetService.endpoint}`, values)
    return res.data
  }

  static async update(args: {
    id: number
    values: {
      spravochnikBudjetNameId: number
      mainSchetId: number
      nachislenieYear: number
      nachislenieMonth: number
      docNum: number
      docDate: string
      mainZarplataId: number
      rabDni: number
      otrabDni: number
      noch: number
      prazdnik: number
      pererabodka: number
      kazarma: number
    }
  }) {
    const res = await zarplataApiNew.put(`${OtdelniyRaschetService.endpoint}/update`, args.values, {
      params: {
        mainId: args.id
      }
    })
    return res.data
  }

  static async delete(id: number) {
    const res = await zarplataApiNew.delete(`${OtdelniyRaschetService.endpoint}/${id}`)
    return res.data
  }

  static async createPayment(values: OtdelniyRaschetPaymentFormValues) {
    const res = await zarplataApiNew.post(`${OtdelniyRaschetService.endpoint}/creat-payment`, {
      ...values
    })
    return res.data
  }

  static async createDeduction(values: OtdelniyRaschetPaymentFormValues) {
    const res = await zarplataApiNew.post(`${OtdelniyRaschetService.endpoint}/creat-deduction`, {
      ...values
    })
    return res.data
  }

  static async updatePayment(args: { id: number; values: OtdelniyRaschetPaymentFormValues }) {
    const res = await zarplataApiNew.put(
      `${OtdelniyRaschetService.endpoint}/update-payment`,
      args.values,
      {
        params: {
          id: args.id
        }
      }
    )
    return res.data
  }

  static async deletePayment(id: number) {
    const res = await zarplataApiNew.delete(
      `${OtdelniyRaschetService.endpoint}/delete-payment/${id}`
    )
    return res.data
  }

  static async updateDeduction(args: { id: number; values: OtdelniyRaschetPaymentFormValues }) {
    const res = await zarplataApiNew.put(
      `${OtdelniyRaschetService.endpoint}/update-deduction`,
      args.values,
      {
        params: {
          id: args.id
        }
      }
    )
    return res.data
  }

  static async deleteDeduction(id: number) {
    const res = await zarplataApiNew.delete(
      `${OtdelniyRaschetService.endpoint}/delete-deduction/${id}`
    )
    return res.data
  }

  static async getMaxDocNum() {
    const res = await zarplataApiNew.get<number>(
      `${OtdelniyRaschetService.endpoint}/get-max-docNum`
    )
    return res.data
  }

  static async calculateChild(mainId: number) {
    const res = await zarplataApiNew.put(
      `${OtdelniyRaschetService.endpoint}/calculate`,
      {},
      {
        params: {
          mainId
        }
      }
    )
    return res.data
  }

  static async getByMonthly(budjetId: number, year: number, month: number) {
    const res = await zarplataApiNew.get<OtdelniyRaschet[]>(
      `${OtdelniyRaschetService.endpoint}/get-by-monthly`,
      {
        params: {
          spBudnameId: budjetId,
          year,
          month
        }
      }
    )
    return res.data
  }
}
