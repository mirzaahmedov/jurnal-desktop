import type { OtherVedemostFormValues } from './config'
import type { PayrollDeductionFormValues } from '@/common/features/payroll-deduction/config'
import type { OtherVedemost, OtherVedemostPayment, OtherVedemostProvodka } from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { getMultiApiResponse } from '@/common/lib/zarplata'
import { type ZarplataApiResponse, zarplataApiNew } from '@/common/lib/zarplata_new'

export class OtherVedemostService {
  static endpoint = 'NachislenieOthers'

  static QueryKeys = {
    GetAll: 'nachislenie_others/all',
    GetById: 'nachislenie_others/:id',
    GetByVacantId: 'nachislenie_others/vacantId',
    GetChildren: 'nachislenie_others/children',
    GetChildById: 'nachislenie_others/get-child-by-id',
    GetPayments: 'nachislenie_others/payments'
  }

  static async getAll(
    ctx: QueryFunctionContext<
      [
        typeof OtherVedemostService.QueryKeys.GetAll,
        {
          page: number
          limit: number
          year?: number
          month?: number
          doc_num?: string
          budjet_name_id: number
          type?: string
        }
      ]
    >
  ) {
    const params = ctx.queryKey[1]
    const res = await zarplataApiNew.get<ZarplataApiResponse<OtherVedemost[]>>(
      `${OtherVedemostService.endpoint}`,
      {
        params
      }
    )
    return getMultiApiResponse({
      response: res.data,
      page: params.page,
      limit: params.limit
    })
  }

  static async getById(
    ctx: QueryFunctionContext<
      [
        typeof OtherVedemostService.QueryKeys.GetById,
        number,
        {
          vacantId?: number
        }
      ]
    >
  ) {
    const id = ctx.queryKey[1]
    const params = ctx.queryKey[2] || {}
    const res = await zarplataApiNew.get<OtherVedemostProvodka[]>(
      `${OtherVedemostService.endpoint}/${id}`,
      {
        params
      }
    )
    return res.data
  }

  static async getChildren(
    ctx: QueryFunctionContext<[typeof OtherVedemostService.QueryKeys.GetChildren, number]>
  ) {
    const res = await zarplataApiNew.get<OtherVedemostProvodka[]>(
      `${OtherVedemostService.endpoint}/children/${ctx.queryKey[1]}`
    )
    return res.data
  }

  static async getChildById(
    ctx: QueryFunctionContext<[typeof OtherVedemostService.QueryKeys.GetChildById, number]>
  ) {
    const res = await zarplataApiNew.get<OtherVedemostProvodka>(
      `${OtherVedemostService.endpoint}/get-child`,
      {
        params: {
          childId: ctx.queryKey[1]
        }
      }
    )
    return res.data
  }

  static async getPayments(
    ctx: QueryFunctionContext<[typeof OtherVedemostService.QueryKeys.GetChildren, number]>
  ) {
    const res = await zarplataApiNew.get<OtherVedemostPayment[]>(
      `${OtherVedemostService.endpoint}/payments/${ctx.queryKey[1]}`
    )
    return res.data
  }

  static async getMaxDocNum() {
    const res = await zarplataApiNew.get<number>(`${OtherVedemostService.endpoint}/get-max-docNum`)
    return res.data
  }

  static async create(values: OtherVedemostFormValues) {
    const res = await zarplataApiNew.post<ZarplataApiResponse<OtherVedemost[]>>(
      `${OtherVedemostService.endpoint}`,
      values
    )
    return res.data
  }

  static async update(args: { id: number; values: OtherVedemostFormValues }) {
    const res = await zarplataApiNew.put<ZarplataApiResponse<OtherVedemost[]>>(
      `${OtherVedemostService.endpoint}/${args.id}`,
      args.values
    )
    return res.data
  }

  static async delete(id: number) {
    const res = await zarplataApiNew.delete<ZarplataApiResponse<OtherVedemost[]>>(
      `${OtherVedemostService.endpoint}/${id}`
    )
    return res.data
  }

  static async createDeduction(params: { childId: number; values: PayrollDeductionFormValues }) {
    const { childId, values } = params
    const res = await zarplataApiNew.post(
      `${OtherVedemostService.endpoint}/create-deduction`,
      {
        ...values
      },
      {
        params: {
          childId
        }
      }
    )
    return res.data
  }

  static async updateDeduction(params: {
    deductionId: number
    values: PayrollDeductionFormValues
  }) {
    const { deductionId, values } = params
    const res = await zarplataApiNew.put(
      `${OtherVedemostService.endpoint}/update-deduction`,
      values,
      {
        params: {
          deductionId
        }
      }
    )
    return res.data
  }

  static async deleteDeduction(deductionId: number) {
    const res = await zarplataApiNew.delete(`${OtherVedemostService.endpoint}/delete-deduction`, {
      params: {
        deductionId
      }
    })
    return res.data
  }

  static async updateSumma(params: { childId: number; summa: number }) {
    const { childId, summa } = params
    const res = await zarplataApiNew.put(
      `${OtherVedemostService.endpoint}/update-summa`,
      {},
      {
        params: {
          childId,
          nachisSumma: summa
        }
      }
    )
    return res.data
  }

  static async calculateChildById(params: { childId: number }) {
    const { childId } = params
    const res = await zarplataApiNew.put(
      `${OtherVedemostService.endpoint}/calculate`,
      {},
      {
        params: {
          childId
        }
      }
    )
    return res.data
  }
}
