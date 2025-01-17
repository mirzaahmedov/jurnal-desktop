import type { Naimenovanie, NaimenovanieKol } from '@/common/models'
import type { DenominationPayloadType } from './constants'
import type { SpravochnikHookOptions } from '@/common/features/spravochnik'

import { APIEndpoints, CRUDService } from '@/common/features/crud'
import { naimenovanieColumns, naimenovanieKolColumns } from './columns'
import { extendObject } from '@/common/lib/utils'

export const naimenovanieService = new CRUDService<Naimenovanie, DenominationPayloadType>({
  endpoint: APIEndpoints.jur7_naimenovanie
})
const naimenovanieKolService = new CRUDService<NaimenovanieKol>({
  endpoint: APIEndpoints.jur7_naimenovanie_kol
}).forRequest((type, req) => {
  if (type === 'getById') {
    return {
      url: `/jur_7/naimenovanie/${req.ctx?.queryKey[1]}`
    }
  }
  return req
})

const createNaimenovanieSpravochnik = (config: Partial<SpravochnikHookOptions<Naimenovanie>>) => {
  return extendObject(
    {
      title: 'Выберите наименование',
      endpoint: APIEndpoints.jur7_naimenovanie,
      columns: naimenovanieColumns,
      service: naimenovanieService
    } satisfies typeof config,
    config
  )
}

const createNaimenovanieKolSpravochnik = (
  config: Partial<SpravochnikHookOptions<NaimenovanieKol>>
) => {
  return extendObject(
    {
      title: 'Выберите наименование',
      endpoint: APIEndpoints.jur7_naimenovanie_kol,
      columns: naimenovanieKolColumns,
      service: naimenovanieKolService
    } satisfies typeof config,
    config
  )
}

export { createNaimenovanieSpravochnik, createNaimenovanieKolSpravochnik }
