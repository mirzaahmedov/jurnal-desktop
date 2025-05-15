import type { SpravochnikHookOptions } from '../spravochnik'
import type { ApiResponse, MainZarplata } from '@/common/models'
import type { QueryFunctionContext } from '@tanstack/react-query'

import { t } from 'i18next'

import { capitalize } from '@/common/lib/string'
import { extendObject } from '@/common/lib/utils'
import { zarplataApi } from '@/common/lib/zarplata'

import { getUserId } from '../auth'
import { mainZarplataColumns } from './columns'

export const mainZarplataService = {
  async getAll(
    ctx: QueryFunctionContext<
      [
        string,
        {
          page: number
        }
      ]
    >
  ): Promise<ApiResponse<MainZarplata[], { pageCount: number }>> {
    const { page } = ctx.queryKey[1]
    const res = await zarplataApi.get<{
      totalCount: number
      data: MainZarplata[]
    }>('MainZarplata', {
      params: {
        PageIndex: page,
        PageSize: 10,
        userId: getUserId()
      }
    })
    return {
      success: true,
      data: res.data?.data,
      meta: {
        pageCount: Math.ceil(res?.data?.totalCount / 10)
      }
    }
  },

  async getById(
    ctx: QueryFunctionContext<[string, number]>
  ): Promise<ApiResponse<MainZarplata, null>> {
    const id = ctx.queryKey[1]
    const res = await zarplataApi.get<MainZarplata>(`MainZarplata/${id}`)
    return {
      success: true,
      data: res?.data,
      meta: null
    }
  }
}

export const createMainZarplataSpravochnik = (
  config: Partial<SpravochnikHookOptions<MainZarplata>>
) => {
  return extendObject(
    {
      title: capitalize(t('choose', { what: t('podotchet-litso') })),
      columnDefs: mainZarplataColumns,
      endpoint: 'main-zarplata' as any,
      // Todo fix this
      service: mainZarplataService as any,
      filters: []
    } satisfies typeof config,
    config
  )
}
