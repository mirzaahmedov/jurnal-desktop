import type { SmetaGrafikFormValues } from './config'
import type { Response, SmetaGrafik } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { main_schet } from '@/common/features/crud/middleware'

export class SmetaGrafiCRUDkService extends CRUDService<SmetaGrafik, SmetaGrafikFormValues> {
  constructor() {
    super({
      endpoint: ApiEndpoints.smeta_grafik
    })

    this.create = this.create.bind(this)
  }

  async create(values: SmetaGrafikFormValues) {
    const res = await this.client.post<Response<string, undefined>>(
      this.endpoint,
      {
        smetas: values.smetas
      },
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
