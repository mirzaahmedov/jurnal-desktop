import type { PereotsenkaFormValues } from './config'
import type { SpravochnikHookOptions } from '@/common/features/spravochnik'
import type { Group, Pereotsenka, Response } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { http } from '@/common/lib/http'
import { extendObject } from '@/common/lib/utils'

import { PereotsenkaColumns } from './columns'

// Todo: fix this service

export const PereotsenkaService = new CRUDService<Pereotsenka, PereotsenkaFormValues>({
  endpoint: ApiEndpoints.jur7_pereotsenka
})

export type CreateBatchParams = {
  data: PereotsenkaFormValues[]
}
export const pereotsenkaCreateBatchQuery = async ({ data }: CreateBatchParams) => {
  const res = await http.post('/jur_7/pereotsenka', { data })
  return res.data
}

export const createPereotsenkaSpravochnik = (
  config: Partial<SpravochnikHookOptions<Pereotsenka>>
) => {
  return extendObject(
    {
      title: 'Выберите переоценку',
      endpoint: ApiEndpoints.jur7_pereotsenka,
      columnDefs: PereotsenkaColumns,
      service: PereotsenkaService
    } satisfies typeof config,
    config
  )
}

export const getLatestPereotsenkaQuery = async () => {
  const res =
    await http.get<Response<Group & Pick<Pereotsenka, 'pereotsenka_foiz'>>>('/jur_7/group/percent')
  return res.data
}
