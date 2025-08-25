import type { ZarplataSpravochnikFormValues, ZarplataSpravochnikType } from './config'
import type { SpravochnikHookOptions } from '@/common/features/spravochnik'
import type { ApiResponse, Zarplata } from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { ApiEndpoints } from '@/common/features/crud'
import { SpravochnikSearchField } from '@/common/features/filters/search/search-filter-spravochnik'
import { extendObject } from '@/common/lib/utils'
import { getMultiApiResponse, getSingleApiResponse } from '@/common/lib/zarplata'
import { type ZarplataApiResponse, zarplataApiNew } from '@/common/lib/zarplata_new'

import { getZarplataSpravochnikDialogColumnDefs } from './columns'

export class ZarplataSpravochnikService {
  static Endpoint = ApiEndpoints.zarplata_spravochnik

  static QueryKeys = {
    Create: 'zarplata-spravochnik/create',
    Update: 'zarplata-spravochnik/update',
    Delete: 'zarplata-spravochnik/delete',
    GetAll: 'zarplata-spravochnik/all',
    GetTypes: 'zarplata-spravochnik/get-types'
  }

  static async getAll(
    ctx: QueryFunctionContext<
      [
        string,
        {
          types_type_code: number
          search?: string
          page?: number
          limit?: number
        }
      ]
    >
  ): Promise<ApiResponse<Zarplata.Spravochnik[]>> {
    const { types_type_code, search, page, limit } = ctx.queryKey[1]

    const res = await zarplataApiNew.get<ZarplataApiResponse<Zarplata.Spravochnik[]>>(
      `${ZarplataSpravochnikService.Endpoint}/get-sp/${types_type_code}`,
      {
        params: {
          PageIndex: page,
          PageSize: limit,
          search: search
        }
      }
    )
    return getMultiApiResponse({
      response: res.data,
      page: page ?? 1,
      limit: limit ?? 10
    })
  }
  static async getById(
    ctx: QueryFunctionContext<[string, number]>
  ): Promise<ApiResponse<Zarplata.Spravochnik>> {
    const id = ctx.queryKey[1]
    const res = await zarplataApiNew.get<Zarplata.Spravochnik>(
      `${ZarplataSpravochnikService.Endpoint}/${id}`
    )
    return getSingleApiResponse({
      response: res.data
    })
  }

  static async getTypes() {
    const res = await zarplataApiNew.get<ZarplataApiResponse<Zarplata.SpravochnikType[]>>(
      `${ZarplataSpravochnikService.Endpoint}/get-types`
    )
    return res.data
  }

  static async create(values: ZarplataSpravochnikFormValues) {
    const res = await zarplataApiNew.post<Zarplata.Spravochnik>(
      `${ZarplataSpravochnikService.Endpoint}`,
      values
    )
    return res.data
  }

  static async update({ id, values }: { id: number; values: ZarplataSpravochnikFormValues }) {
    const res = await zarplataApiNew.put<Zarplata.Spravochnik>(
      `${ZarplataSpravochnikService.Endpoint}/${id}`,
      values
    )
    return res.data
  }

  static async delete(id: number) {
    const res = await zarplataApiNew.delete<Zarplata.Spravochnik>(
      `${ZarplataSpravochnikService.Endpoint}/${id}`
    )
    return res.data
  }
}

export const createZarplataSpravochnik = (
  config: Partial<SpravochnikHookOptions<Zarplata.Spravochnik>>
) => {
  return extendObject(
    {
      endpoint: ApiEndpoints.zarplata_spravochnik,
      columnDefs: getZarplataSpravochnikDialogColumnDefs(
        config.params?.types_type_code as ZarplataSpravochnikType
      ),
      service: ZarplataSpravochnikService,
      filters: [SpravochnikSearchField]
    } satisfies typeof config,
    config
  )
}
