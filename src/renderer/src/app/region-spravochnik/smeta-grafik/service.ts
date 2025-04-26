import type { SmetaGrafikFormValues, SmetaGrafikProvodkaFormValue } from './config'
import type { Response, SmetaGrafik } from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { main_schet } from '@/common/features/crud/middleware'

interface SmetaGrafikPayload extends SmetaGrafikProvodkaFormValue {
  year: number
  spravochnik_budjet_name_id: number
  main_schet_id: number
}

export class SmetaGrafiCRUDkService extends CRUDService<SmetaGrafik, SmetaGrafikPayload> {
  constructor() {
    super({
      endpoint: ApiEndpoints.smeta_grafik
    })

    this.batchCreate = this.batchCreate.bind(this)
    this.getOld = this.getOld.bind(this)
  }

  async batchCreate(values: SmetaGrafikFormValues) {
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

  async getOld(
    ctx: QueryFunctionContext<[string, { year: number; budjet_id: number; main_schet_id: number }]>
  ) {
    const params = ctx.queryKey[1]
    const res = await this.client.get<Response<SmetaGrafik[]>>(`/${this.endpoint}/old`, { params })
    return res.data
  }
}

export const SmetaGrafikService = new SmetaGrafiCRUDkService().use(main_schet())
