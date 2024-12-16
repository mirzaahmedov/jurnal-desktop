import type { Group } from '@/common/models'
import type { GroupPayloadType } from './constants'
import type { SpravochnikHookOptions } from '@/common/features/spravochnik'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { groupColumns } from './columns'
import { extendObject } from '@/common/lib/utils'

export const groupService = new CRUDService<Group, GroupPayloadType>({
  endpoint: ApiEndpoints.jur7_group
})

export const createGroupSpravochnik = (config: Partial<SpravochnikHookOptions<Group>>) => {
  return extendObject(
    {
      title: 'Выберите группу',
      endpoint: ApiEndpoints.jur7_group,
      columns: groupColumns,
      service: groupService
    } satisfies typeof config,
    config
  )
}
