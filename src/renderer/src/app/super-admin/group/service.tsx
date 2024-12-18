import type { Group } from '@/common/models'
import type { GroupPayloadType } from './constants'
import type { SpravochnikHookOptions } from '@/common/features/spravochnik'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { groupColumns } from './columns'
import { extendObject } from '@/common/lib/utils'
import { SpravochnikSearchField } from '@renderer/common/features/search'
import { treeFromArray } from './utils'
import { useMemo } from 'react'
import { CollapsibleTable } from '@renderer/common/components/collapsible-table'

export const groupService = new CRUDService<Group, GroupPayloadType>({
  endpoint: ApiEndpoints.jur7_group
})

const GroupTable: SpravochnikHookOptions<Group>['CustomTable'] = ({
  data,
  columns,
  onClickRow
}) => {
  const nested = useMemo(() => treeFromArray(data), [data])
  return (
    <CollapsibleTable
      data={nested}
      columns={columns}
      onClickRow={onClickRow}
    />
  )
}

export const createGroupSpravochnik = (config: Partial<SpravochnikHookOptions<Group>>) => {
  return extendObject(
    {
      title: 'Выберите группу',
      endpoint: ApiEndpoints.jur7_group,
      columns: groupColumns,
      service: groupService,
      filters: [SpravochnikSearchField],
      CustomTable: GroupTable,
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
