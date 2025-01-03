import type { SmetaGrafik } from '@/common/models'
import type { SmetaGrafikForm } from './constants'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { extendObject } from '@renderer/common/lib/utils'
import { ColumnDef } from '@renderer/common/components'
import { SpravochnikHookOptions } from '@renderer/common/features/spravochnik'

export const smetaGrafikService = new CRUDService<SmetaGrafik, SmetaGrafikForm>({
  endpoint: ApiEndpoints.smeta_grafik
})

export const createSmetaGrafikSpravochnik = (
  config: Partial<SpravochnikHookOptions<SmetaGrafik>>
) => {
  return extendObject(
    {
      title: 'Выберите смету',
      endpoint: ApiEndpoints.smeta_grafik,
      columns: [
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
