import type { MonthValue } from '@/common/features/saldo'
import type { PodotchetSaldo, Response, ResponseMeta } from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { budjet, main_schet } from '@/common/features/crud/middleware'
import { getBudjetId } from '@/common/features/requisites'
import { withPreprocessor } from '@/common/lib/validation'

interface PodotchetSaldoMeta extends ResponseMeta {
  summa: number
}

interface PodotchetSaldoCreateAutoArgs {
  year: number
  month: number
  main_schet_id: number
  schet_id: number
}

class PodotchetSaldoServiceBuilder extends CRUDService<
  PodotchetSaldo,
  PodotchetSaldoFormValues,
  PodotchetSaldoFormValues,
  PodotchetSaldoMeta
> {
  constructor() {
    super({
      endpoint: ApiEndpoints.podotchet_saldo
    })

    this.autoCreate = this.autoCreate.bind(this)
    this.getMonthlySaldo = this.getMonthlySaldo.bind(this)
    this.cleanSaldo = this.cleanSaldo.bind(this)
  }

  async autoCreate(args: PodotchetSaldoCreateAutoArgs) {
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
    const { main_schet_id, schet_id, password } = values
    const res = await this.client.delete(`${this.endpoint}/clean`, {
      params: {
        main_schet_id,
        schet_id,
        password
      }
    })
    return res.data
  }
}

export const PodotchetSaldoService = new PodotchetSaldoServiceBuilder()
  .use(budjet())
  .use(main_schet())

export const PodotchetSaldoFormSchema = withPreprocessor(
  z.object({
    summa: z.number().optional(),
    year: z.number(),
    month: z.number(),
    main_schet_id: z.number().optional(),
    schet_id: z.number().optional()
  })
)

export type PodotchetSaldoFormValues = z.infer<typeof PodotchetSaldoFormSchema>
