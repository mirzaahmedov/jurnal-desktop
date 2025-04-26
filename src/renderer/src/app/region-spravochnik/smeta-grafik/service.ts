import type { SmetaGrafikBatchFormValues, SmetaGrafikFormValues } from './config'
import type { SmetaGrafik } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { main_schet } from '@/common/features/crud/middleware'

export class SmetaGrafiCRUDkService extends CRUDService<SmetaGrafik, SmetaGrafikFormValues> {
  constructor() {
    super({
      endpoint: ApiEndpoints.smeta_grafik
    })

    this.batchCreate = this.batchCreate.bind(this)
  }

  async batchCreate(values: SmetaGrafikBatchFormValues) {
    const res = await this.client.post(
      `/${this.endpoint}/multi/insert`,
      values,
      this.proccessMiddleware({
        params: {
          year: values.year
        }
      })
    )
    return res.data
  }
}

export const SmetaGrafikService = new SmetaGrafiCRUDkService().use(main_schet())
