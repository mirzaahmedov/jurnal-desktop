import type { SaldoFormValues } from './config'
import type { MonthValue } from '@/common/features/saldo'
import type { ApiResponse, SaldoProduct } from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { budjet, main_schet } from '@/common/features/crud/middleware'

export enum OstatokViewOption {
  PRODUCT = 'product',
  RESPONSIBLE = 'responsible',
  GROUP = 'group'
}

class MaterialWarehouseSaldoServiceBuilder extends CRUDService<never, SaldoFormValues> {
  constructor() {
    super({
      endpoint: ApiEndpoints.jur7_saldo
    })

    this.deleteSaldoMonth = this.deleteSaldoMonth.bind(this)
    this.cleanSaldo = this.cleanSaldo.bind(this)
    this.checkSaldo = this.checkSaldo.bind(this)
    this.getMonthlySaldo = this.getMonthlySaldo.bind(this)
  }

  async deleteSaldoMonth(values: {
    year: number
    month: number
    budjet_id: number
    main_schet_id: number
  }) {
    const { budjet_id, main_schet_id, year, month } = values
    const res = await this.client.delete(this.endpoint, {
      data: {
        year,
        month
      },
      params: {
        budjet_id,
        main_schet_id
      }
    })
    return res.data
  }

  async cleanSaldo(values: { budjet_id: number; password: string }) {
    const { budjet_id, password } = values
    const res = await this.client.delete<ApiResponse<unknown>>(`${this.endpoint}/clean`, {
      params: {
        budjet_id,
        password
      }
    })
    return res.data
  }

  async checkSaldo(
    ctx: QueryFunctionContext<
      [string, { month: number; year: number; budjet_id: number; main_schet_id: number }, string]
    >
  ) {
    const { month, year, budjet_id, main_schet_id } = ctx.queryKey[1] ?? {}
    const res = await this.client.get<ApiResponse<unknown[]>>(`${this.endpoint}/check`, {
      params: {
        month,
        year,
        budjet_id,
        main_schet_id
      }
    })
    return res.data
  }

  async getMonthlySaldo(
    ctx: QueryFunctionContext<[string, { year: number; budjet_id: number; main_schet_id: number }]>
  ) {
    const { year, budjet_id, main_schet_id } = ctx.queryKey[1] ?? {}
    const res = await this.client.get<ApiResponse<MonthValue[]>>(
      `${ApiEndpoints.jur7_monitoring}/saldo/date`,
      {
        params: {
          year,
          budjet_id,
          main_schet_id
        }
      }
    )
    return res.data
  }
}

// Todo: remove this service
export const MaterialWarehouseSaldoService = new MaterialWarehouseSaldoServiceBuilder()
  .use(budjet())
  .use(main_schet())
  .forRequest((type, args) => {
    if (type === 'create') {
      return {
        config: {
          ...args.config,
          headers: {
            ...args.config.headers,
            'notify-error': false
          }
        }
      }
    }
    return {}
  })

export const MaterialWarehouseSaldoProductService = new CRUDService<SaldoProduct>({
  endpoint: ApiEndpoints.saldo_product
})
  .use(budjet())
  .use(main_schet())
