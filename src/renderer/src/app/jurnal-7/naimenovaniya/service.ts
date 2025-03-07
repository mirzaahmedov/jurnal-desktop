import type { DenominationPayloadType } from './constants'
import type { SpravochnikHookOptions } from '@/common/features/spravochnik'
import type { Naimenovanie, NaimenovanieKol } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { extendObject } from '@/common/lib/utils'

import { naimenovanieColumns, naimenovanieKolColumns } from './columns'

export const naimenovanieService = new CRUDService<Naimenovanie, DenominationPayloadType>({
  endpoint: ApiEndpoints.jur7_naimenovanie
})
const naimenovanieKolService = new CRUDService<NaimenovanieKol>({
  endpoint: ApiEndpoints.jur7_naimenovanie_kol
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
      endpoint: ApiEndpoints.jur7_naimenovanie,
      columnDefs: naimenovanieColumns,
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
      endpoint: ApiEndpoints.jur7_naimenovanie_kol,
      columnDefs: naimenovanieKolColumns,
      service: naimenovanieKolService
    } satisfies typeof config,
    config
  )
}

export { createNaimenovanieSpravochnik, createNaimenovanieKolSpravochnik }
