import type { SaldoFormValues } from './config'
import type { MaterialCreateProvodkaFormValues } from './create/config'
import type { MonthValue } from '@/common/features/saldo'
import type { ApiResponse, ApiResponseMeta, SaldoProduct } from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { budjet, main_schet } from '@/common/features/crud/middleware'

export interface MaterialMeta extends ApiResponseMeta {
  from_summa: number
  from_kol: number
  internal_rasxod_summa: number
  internal_rasxod_kol: number
  internal_prixod_summa: number
  internal_prixod_kol: number
  to_summa: number
  to_iznos_summa: number
  to_kol: number
  page_from_summa: number
  page_from_kol: number
  page_internal_rasxod_summa: number
  page_internal_rasxod_kol: number
  page_internal_prixod_summa: number
  page_internal_prixod_kol: number
  page_to_summa: number
  page_to_iznos_summa: number
  page_to_kol: number
}

export enum MaterialSaldoViewOptions {
  PRODUCT = 'product',
  RESPONSIBLE = 'responsible',
  GROUP = 'group'
}

class MaterialSaldoServiceBuilder extends CRUDService<never, SaldoFormValues> {
  constructor() {
    super({
      endpoint: ApiEndpoints.jur7_saldo
    })

    this.deleteMonth = this.deleteMonth.bind(this)
    this.deleteOne = this.deleteOne.bind(this)
    this.createMany = this.createMany.bind(this)
    this.cleanSaldo = this.cleanSaldo.bind(this)
    this.checkSaldo = this.checkSaldo.bind(this)
    this.checkCreate = this.checkCreate.bind(this)
    this.getMonthlySaldo = this.getMonthlySaldo.bind(this)
    this.transferProducts = this.transferProducts.bind(this)
  }

  async checkCreate(values: { main_schet_id: number; year: number; month: number }) {
    const { main_schet_id, year, month } = values
    const res = await this.client.get<ApiResponse<boolean>>(`${this.endpoint}/check-create`, {
      params: {
        main_schet_id,
        year,
        month
      }
    })
    return res.data
  }

  async createMany(values: {
    data: MaterialCreateProvodkaFormValues[]
    main_schet_id: number
    budjet_id: number
    year: number
    month: number
  }) {
    const res = await this.client.post(
      this.endpoint + '/by-group',
      {
        data: values.data
      },
      {
        params: {
          main_schet_id: values.main_schet_id,
          budjet_id: values.budjet_id,
          year: values.year,
          month: values.month
        }
      }
    )
    return res.data
  }

  async deleteOne(values: {
    year: number
    month: number
    budjet_id: number
    main_schet_id: number
    id: number
  }) {
    const { budjet_id, main_schet_id, year, month, id } = values
    const res = await this.client.delete(this.endpoint + '/' + id, {
      params: {
        budjet_id,
        main_schet_id,
        year,
        month
      }
    })
    return res.data
  }

  async deleteMonth(values: {
    month: number
    year: number
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

  async transferProducts(values: {
    data: Array<{
      product_id: number
      old_group_id: number
      new_group_id: number
    }>
  }) {
    const res = await this.client.put<ApiResponse<boolean>>(
      `${this.endpoint}/transfer-group`,
      values
    )
    return res.data
  }
}

export const MaterialSaldoService = new MaterialSaldoServiceBuilder()
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

export const MaterialSaldoProductService = new CRUDService<SaldoProduct, null, null, MaterialMeta>({
  endpoint: ApiEndpoints.saldo_product
})
  .use(budjet())
  .use(main_schet())
