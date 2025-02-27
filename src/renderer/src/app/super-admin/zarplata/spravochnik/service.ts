import type { ZarplataSpravochnikFormValues } from './config'
import type { PaginationParams, Response } from '@/app/super-admin/zarplata/common/api'
import type { Zarplata } from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { zarplataApi } from '@/app/super-admin/zarplata/common/api'

export class ZarplataSpravochnikService {
  static endpoint = '/SpravochnikZarplatum'

  static queryKeys = {
    create: 'zarplata-spravochnik/create',
    update: 'zarplata-spravochnik/update',
    delete: 'zarplata-spravochnik/delete',
    getAll: 'zarplata-spravochnik/all',
    getTypes: 'zarplata-spravochnik/get-types'
  }

  static async getAll(
    ctx: QueryFunctionContext<[string, PaginationParams & { types_type_code: number }]>
  ): Promise<Zarplata.Spravochnik[]> {
    const { PageIndex, PageSize, types_type_code } = ctx.queryKey[1]

    const res = await zarplataApi.get<Zarplata.Spravochnik[]>(
      `${ZarplataSpravochnikService.endpoint}/get-by-query`,
      {
        params: {
          PageIndex,
          PageSize,
          types_type_code
        }
      }
    )
    return res.data
  }

  static async getTypes() {
    const res = await zarplataApi.get<Response<Zarplata.SpravochnikType[]>>(
      `${ZarplataSpravochnikService.endpoint}/get-types`
    )
    return res.data
  }

  static async create(values: ZarplataSpravochnikFormValues) {
    const res = await zarplataApi.post<Zarplata.Spravochnik>(
      `${ZarplataSpravochnikService.endpoint}`,
      values
    )
    return res.data
  }

  static async update({ id, values }: { id: number; values: ZarplataSpravochnikFormValues }) {
    const res = await zarplataApi.put<Zarplata.Spravochnik>(
      `${ZarplataSpravochnikService.endpoint}/${id}`,
      values
    )
    return res.data
  }
}
