import type { Group, Pereotsenka, Response } from '@/common/models'
import type { PereotsenkaForm } from './config'
import type { SpravochnikHookOptions } from '@/common/features/spravochnik'

import { APIEndpoints, CRUDService } from '@/common/features/crud'
import { extendObject } from '@/common/lib/utils'
import { pereotsenkaColumns } from './columns'
import { http } from '@/common/lib/http'

const pereotsenkaService = new CRUDService<Pereotsenka, PereotsenkaForm>({
  endpoint: APIEndpoints.jur7_pereotsenka
})

type CreateBatchParams = {
  data: PereotsenkaForm[]
}
const pereotsenkaCreateBatchQuery = async ({ data }: CreateBatchParams) => {
  const res = await http.post('/jur_7/pereotsenka', { data })
  return res.data
}

const createPereotsenkaSpravochnik = (config: Partial<SpravochnikHookOptions<Pereotsenka>>) => {
  return extendObject(
    {
      title: 'Выберите переоценку',
      endpoint: APIEndpoints.jur7_pereotsenka,
      columnDefs: pereotsenkaColumns,
      service: pereotsenkaService
    } satisfies typeof config,
    config
  )
}

const getLatestPereotsenkaQuery = async () => {
  const res =
    await http.get<Response<Group & Pick<Pereotsenka, 'pereotsenka_foiz'>>>('/jur_7/group/percent')
  return res.data
}

export {
  pereotsenkaService,
  pereotsenkaCreateBatchQuery,
  createPereotsenkaSpravochnik,
  getLatestPereotsenkaQuery
}
