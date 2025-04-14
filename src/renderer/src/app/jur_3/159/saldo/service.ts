import type { OrganSaldoFormValues } from './config'
import type { MonthValue } from '@/common/features/saldo'
import type { OrganSaldo, OrganSaldoProvodka, Response, ResponseMeta } from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { budjet, main_schet } from '@/common/features/crud/middleware'
import { getBudjetId } from '@/common/features/requisites'

interface OrganSaldoMeta extends ResponseMeta {
  summa: number
}

interface OrganSaldoCreateAutoArgs {
  year: number
  month: number
  main_schet_id: number
  schet_id: number
}

class OrganSaldoServiceBuilder extends CRUDService<
  OrganSaldo,
  OrganSaldoFormValues,
  OrganSaldoFormValues,
  OrganSaldoMeta
> {
  constructor() {
    super({
      endpoint: ApiEndpoints.organ_159_saldo
    })

    this.cleanSaldo = this.cleanSaldo.bind(this)
    this.autoCreate = this.autoCreate.bind(this)
    this.getAutofillData = this.getAutofillData.bind(this)
    this.getMonthlySaldo = this.getMonthlySaldo.bind(this)
    this.getSaldoCheck = this.getSaldoCheck.bind(this)
  }

  async autoCreate(args: OrganSaldoCreateAutoArgs) {
    const res = await this.client.post(`${this.endpoint}/auto`, args, {
      params: {
        budjet_id: getBudjetId()
      }
    })
    return res.data
  }

  async getMonthlySaldo(ctx: QueryFunctionContext<[string, { main_schet_id: number }]>) {
    const { main_schet_id } = ctx.queryKey[1] ?? {}
    const res = await this.client.get<Response<MonthValue[]>>(`${this.endpoint}/date`, {
      params: {
        main_schet_id
      }
    })
    return res.data
  }

  async cleanSaldo(values: { schet_id: number; main_schet_id: number; password: string }) {
    const { schet_id, main_schet_id, password } = values
    const res = await this.client.delete(`${this.endpoint}/clean`, {
      params: {
        schet_id,
        main_schet_id,
        password
      }
    })
    return res.data
  }

  async getAutofillData(params: {
    month: number
    year: number
    first: boolean
    schet_id: number
    main_schet_id: number
    budjet_id: number
  }) {
    const res = await this.client.get<Response<OrganSaldoProvodka[]>>(`${this.endpoint}/data`, {
      params
    })
    return res.data
  }

  async getSaldoCheck(params: { budjet_id: number; main_schet_id: number; schet_id: number }) {
    const res = await this.client.get<Response<unknown>>(`${this.endpoint}/first`, {
      headers: {
        'notify-error': false
      },
      params
    })
    return res.data
  }
}

export const OrganSaldoService = new OrganSaldoServiceBuilder().use(budjet()).use(main_schet())
