import type { SmetaGrafikForm } from './constants'
import type { SmetaGrafik } from '@/common/models'

import { ColumnDef } from '@renderer/common/components'
import { SpravochnikHookOptions } from '@renderer/common/features/spravochnik'
import { extendObject } from '@renderer/common/lib/utils'

import { APIEndpoints, CRUDService } from '@/common/features/crud'

export const smetaGrafikService = new CRUDService<SmetaGrafik, SmetaGrafikForm>({
  endpoint: APIEndpoints.smeta_grafik
})

export const createSmetaGrafikSpravochnik = (
  config: Partial<SpravochnikHookOptions<SmetaGrafik>>
) => {
  return extendObject(
    {
      title: 'Выберите смету',
      endpoint: APIEndpoints.smeta_grafik,
      columnDefs: [
        {
          key: 'smeta_number',
          header: 'Номер сметы'
        },
        {
          key: 'smeta_name',
          header: 'Наименование сметы'
        },
        {
          numeric: true,
          key: 'itogo',
          header: 'Итого'
        }
      ] satisfies ColumnDef<SmetaGrafik>[],
      service: smetaGrafikService,
      params: extendObject(
        {
          page: 1,
          limit: 100000
        },
        config.params ?? {}
      )
    } satisfies typeof config,
    config
  )
}
