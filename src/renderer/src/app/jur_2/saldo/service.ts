import type { BankSaldo, ResponseMeta } from '@/common/models'

import { z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { budjet, main_schet } from '@/common/features/crud/middleware'
import { getBudjetId } from '@/common/features/requisites'
import { withPreprocessor } from '@/common/lib/validation'

interface BankSaldoMeta extends ResponseMeta {
  summa: number
}

interface BankSaldoCreateAutoArgs {
  year: number
  month: number
  main_schet_id: number
}

class BankSaldoServiceFactory extends CRUDService<
  BankSaldo,
  BankSaldoFormValues,
  BankSaldoFormValues,
  BankSaldoMeta
> {
  constructor() {
    super({
      endpoint: ApiEndpoints.bank_saldo
    })

    this.createAuto = this.createAuto.bind(this)
  }

  async createAuto(args: BankSaldoCreateAutoArgs) {
    const res = await this.client.post(`${this.endpoint}/auto`, args, {
      params: {
        budjet_id: getBudjetId()
      }
    })
    return res.data
  }
}

export const BankSaldoService = new BankSaldoServiceFactory().use(budjet()).use(main_schet())

export const BankSaldoFormSchema = withPreprocessor(
  z.object({
    summa: z.number().optional(),
    year: z.number(),
    month: z.number(),
    main_schet_id: z.number().optional()
  })
)

export type BankSaldoFormValues = z.infer<typeof BankSaldoFormSchema>
