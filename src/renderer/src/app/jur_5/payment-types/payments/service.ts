import type { PaymentFormValues } from './config'
import type { SpravochnikHookOptions } from '@/common/features/spravochnik'
import type { Payment } from '@/common/models/payments'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { ApiEndpoints } from '@/common/features/crud'
import { extendObject } from '@/common/lib/utils'
import { getMultiApiResponse, getSingleApiResponse } from '@/common/lib/zarplata'
import { type ZarplataApiResponse, zarplataApiNew } from '@/common/lib/zarplata_new'

import { PaymentColumnDefs } from './columns'
import { PaymentsSpravochnikFilter } from './filters'

export class PaymentsService {
  static endpoint = ApiEndpoints.zarplata_payments
  static client = zarplataApiNew

  static QueryKeys = {
    GetAll: 'payments/GetAll',
    GetById: 'payments/GetById',
    Update: 'payments/Update'
  }

  static async getAll(
    ctx: QueryFunctionContext<
      [
        typeof PaymentsService.QueryKeys.GetAll,
        { page: number; limit: number; name?: string; code?: string }
      ]
    >
  ) {
    const { page, limit, name, code } = ctx.queryKey[1]
    const res = await PaymentsService.client.get<ZarplataApiResponse<Payment[]>>(
      PaymentsService.endpoint,
      {
        params: {
          PageIndex: page,
          PageSize: limit,
          name,
          code
        }
      }
    )
    return getMultiApiResponse({
      response: res.data,
      page,
      limit
    })
  }
  static async getById(
    ctx: QueryFunctionContext<[typeof PaymentsService.QueryKeys.GetById, number]>
  ) {
    const id = ctx.queryKey[1]
    const res = await PaymentsService.client.get<Payment>(`${PaymentsService.endpoint}/${id}`)
    return getSingleApiResponse({
      response: res.data
    })
  }

  static async create(values: PaymentFormValues) {
    const res = await PaymentsService.client.post<Payment>(PaymentsService.endpoint, values)
    return res.data
  }

  static async update(values: PaymentFormValues) {
    const res = await PaymentsService.client.put<Payment>(
      `${PaymentsService.endpoint}/${values.id}`,
      values
    )
    return res.data
  }

  static async delete(id: number) {
    const res = await PaymentsService.client.delete<Payment>(`${PaymentsService.endpoint}/${id}`)
    return res.data
  }
}

export const createPaymentSpravochnik = (config: Partial<SpravochnikHookOptions<Payment>>) => {
  return extendObject(
    {
      endpoint: ApiEndpoints.zarplata_spravochnik,
      columnDefs: PaymentColumnDefs({ isEditable: false }),
      service: PaymentsService,
      dialogProps: {
        className: 'max-w-full h-full max-h-[800px]'
      },
      filters: [PaymentsSpravochnikFilter]
    } satisfies typeof config,
    config
  )
}
