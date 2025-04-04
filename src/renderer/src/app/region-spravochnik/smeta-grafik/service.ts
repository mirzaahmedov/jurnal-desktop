import type { SmetaGrafikForm } from './constants'
import type { ColumnDef } from '@/common/components'
import type { SpravochnikHookOptions } from '@/common/features/spravochnik'
import type { SmetaGrafik } from '@/common/models'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { extendObject } from '@/common/lib/utils'

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
