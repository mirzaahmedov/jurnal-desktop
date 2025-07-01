import type { SpravochnikHookOptions } from '../spravochnik'
import type { MainZarplataFormValues } from '@/app/jur_5/passport-info/config'
import type { ApiResponse, MainZarplata } from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { t } from 'i18next'

import { getUserId } from '@/common/features/auth'
import { ApiEndpoints } from '@/common/features/crud'
import { capitalize } from '@/common/lib/string'
import { extendObject } from '@/common/lib/utils'
import { getMultiApiResponse, getSingleApiResponse, zarplataApi } from '@/common/lib/zarplata'
import { zarplataApiNew } from '@/common/lib/zarplata_new'

import { MainZarplataColumns } from './columns'

export class MainZarplataService {
  static endpoint = ApiEndpoints.main_zarplata

  static QueryKeys = {
    GetAll: 'main_zarplata/getAll',
    GetByVacantId: 'main_zarplata/getByVacantId',
    GetById: 'main_zarplata/getById'
  }

  static async getAll(
    ctx: QueryFunctionContext<
      [
        string,
        {
          page: number
          limit: number
        }
      ]
    >
  ): Promise<ApiResponse<MainZarplata[]>> {
    const { page, limit } = ctx.queryKey[1]
    const res = await zarplataApi.get<{
      totalCount: number
      data: MainZarplata[]
    }>(MainZarplataService.endpoint, {
      params: {
        PageIndex: page,
        PageSize: limit || 10,
        userId: getUserId()
      }
    })
    return getMultiApiResponse({
      response: res.data,
      page,
      limit
    })
  }

  static async getByVacantId(
    ctx: QueryFunctionContext<
      [
        typeof MainZarplataService.QueryKeys.GetByVacantId,
        {
          vacantId: number
        }
      ]
    >
  ) {
    const { vacantId } = ctx.queryKey[1]
    const res = await zarplataApiNew.get<MainZarplata[]>(
      `${MainZarplataService.endpoint}/get-by-vacantId`,
      {
        params: {
          vacantId
        }
      }
    )
    return res.data
  }

  static async getById(
    ctx: QueryFunctionContext<[string, number]>
  ): Promise<ApiResponse<MainZarplata>> {
    const id = ctx.queryKey[1]
    const res = await zarplataApi.get<MainZarplata>(`${MainZarplataService.endpoint}/${id}`)
    return getSingleApiResponse({
      response: res.data
    })
  }

  static async create(values: MainZarplataFormValues): Promise<unknown> {
    const res = await zarplataApiNew.post<MainZarplata>(MainZarplataService.endpoint, values)
    return getSingleApiResponse({
      response: res.data
    })
  }

  static async update({
    id,
    values
  }: {
    id: number
    values: MainZarplataFormValues
  }): Promise<unknown> {
    const res = await zarplataApiNew.put<MainZarplata>(
      `${MainZarplataService.endpoint}/${id}`,
      values
    )
    return getSingleApiResponse({
      response: res.data
    })
  }
}

export const createMainZarplataSpravochnik = (
  config: Partial<SpravochnikHookOptions<MainZarplata>>
) => {
  return extendObject(
    {
      title: capitalize(t('choose', { what: t('podotchet-litso') })),
      columnDefs: MainZarplataColumns,
      endpoint: ApiEndpoints.main_zarplata,
      service: MainZarplataService,
      filters: []
    } satisfies typeof config,
    config
  )
}
