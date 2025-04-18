import type { KassaSaldoFormValues } from './config'
import type { MonthValue } from '@/common/features/saldo'
import type { KassaSaldo, Response, ResponseMeta } from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { budjet, main_schet } from '@/common/features/crud/middleware'
import { getBudjetId } from '@/common/features/requisites'

interface KassaSaldoMeta extends ResponseMeta {
  summa: number
}

interface KassaSaldoCreateAutoArgs {
  year: number
  month: number
  main_schet_id: number
}

class KassaSaldoServiceFactory extends CRUDService<
  KassaSaldo,
  KassaSaldoFormValues,
  KassaSaldoFormValues,
  KassaSaldoMeta
> {
  constructor() {
    super({
      endpoint: ApiEndpoints.kassa_saldo
    })

    this.autoCreate = this.autoCreate.bind(this)
    this.getMonthlySaldo = this.getMonthlySaldo.bind(this)
    this.cleanSaldo = this.cleanSaldo.bind(this)
  }

  async autoCreate(args: KassaSaldoCreateAutoArgs) {
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

  async cleanSaldo(values: { main_schet_id: number; password: string }) {
    const { main_schet_id, password } = values
    const res = await this.client.delete(`${this.endpoint}/clean`, {
      params: {
        main_schet_id,
        password
      }
    })
    return res.data
  }
}

export const KassaSaldoService = new KassaSaldoServiceFactory().use(budjet()).use(main_schet())
