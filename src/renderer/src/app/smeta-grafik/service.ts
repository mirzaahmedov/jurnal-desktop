import type { SmetaGrafikFormValues } from './config'
import type { ApiResponse, SmetaGrafik } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { main_schet } from '@/common/features/crud/middleware'

export class SmetaGrafiCRUDkService extends CRUDService<SmetaGrafik, SmetaGrafikFormValues> {
  constructor() {
    super({
      endpoint: ApiEndpoints.smeta_grafik
    })

    this.create = this.create.bind(this)
    this.getByOrderNumber = this.getByOrderNumber.bind(this)
  }

  async create(values: SmetaGrafikFormValues) {
    const res = await this.client.post<ApiResponse<string, undefined>>(
      this.endpoint,
      {
        smetas: values.smetas,
        command: values.command
      },
      this.proccessMiddleware({
        params: {
          year: values.year
        }
      })
    )
    return res.data
  }

  async getByOrderNumber({ order_number, year }: { order_number: number; year: number }) {
    const res = await this.client.get<ApiResponse<SmetaGrafik>>(
      'smeta/grafik/order-number',
      this.proccessMiddleware({
        params: {
          year,
          order_number
        }
      })
    )
    return res.data
  }
}

export const SmetaGrafikService = new SmetaGrafiCRUDkService().use(main_schet())
