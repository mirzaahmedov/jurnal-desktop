import type { KassaSaldo, ResponseMeta } from '@/common/models'

import { z } from 'zod'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { budjet, main_schet } from '@/common/features/crud/middleware'
import { getBudjetId } from '@/common/features/requisites'
import { withPreprocessor } from '@/common/lib/validation'

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

    this.createAuto = this.createAuto.bind(this)
  }

  async createAuto(args: KassaSaldoCreateAutoArgs) {
    const res = await this.client.post(`${this.endpoint}/auto`, args, {
      params: {
        budjet_id: getBudjetId()
      }
    })
    return res.data
  }
}

export const KassaSaldoService = new KassaSaldoServiceFactory().use(budjet()).use(main_schet())

export const KassaSaldoFormSchema = withPreprocessor(
  z.object({
    summa: z.number().optional(),
    year: z.number(),
    month: z.number(),
    main_schet_id: z.number().optional()
  })
)

export type KassaSaldoFormValues = z.infer<typeof KassaSaldoFormSchema>
