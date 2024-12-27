import { ApiEndpoints, CRUDService } from '@renderer/common/features/crud'
import type { SpravochnikHookOptions } from '@renderer/common/features/spravochnik'
import { extendObject } from '@renderer/common/lib/utils'
import type { Mainbook } from '@renderer/common/models'
import { adminMainbookSchetColumns } from './columns'
import { SpravochnikSearchField } from '@renderer/common/features/search'

export const adminMainbookSchetService = new CRUDService<Mainbook.Schet>({
  endpoint: ApiEndpoints.admin__mainbook_schet
})

export const createMainbookSchetSpravochnik = (
  config: Partial<SpravochnikHookOptions<Mainbook.Schet>>
) => {
  return extendObject(
    {
      title: 'Выберите операцию',
      endpoint: ApiEndpoints.admin__mainbook_schet,
      columns: adminMainbookSchetColumns,
      service: adminMainbookSchetService,
      filters: [SpravochnikSearchField]
    } satisfies typeof config,
    config
  )
}
