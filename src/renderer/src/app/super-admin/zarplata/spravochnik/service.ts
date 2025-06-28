import type { ZarplataSpravochnikFormValues } from './config'
import type { Zarplata } from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { type Response, zarplataApiNew } from '@/common/lib/zarplata_new'

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
    ctx: QueryFunctionContext<
      [string, { types_type_code: number; name?: string; page?: number; limit?: number }]
    >
  ): Promise<Response<Zarplata.Spravochnik[]>> {
    const { types_type_code, name, page, limit } = ctx.queryKey[1]

    const res = await zarplataApiNew.get<Response<Zarplata.Spravochnik[]>>(
      `${ZarplataSpravochnikService.endpoint}/get-sp/${types_type_code}`,
      {
        params: {
          PageIndex: page,
          PageSize: limit,
          search: name
        }
      }
    )
    return res.data
  }

  static async getTypes() {
    const res = await zarplataApiNew.get<Response<Zarplata.SpravochnikType[]>>(
      `${ZarplataSpravochnikService.endpoint}/get-types`
    )
    return res.data
  }

  static async create(values: ZarplataSpravochnikFormValues) {
    const res = await zarplataApiNew.post<Zarplata.Spravochnik>(
      `${ZarplataSpravochnikService.endpoint}`,
      values
    )
    return res.data
  }

  static async update({ id, values }: { id: number; values: ZarplataSpravochnikFormValues }) {
    const res = await zarplataApiNew.put<Zarplata.Spravochnik>(
      `${ZarplataSpravochnikService.endpoint}/${id}`,
      values
    )
    return res.data
  }
}
