import type { GroupPayloadType } from './constants'
import type { SpravochnikHookOptions } from '@/common/features/spravochnik'
import type { Group } from '@/common/models'

import { useMemo } from 'react'

import {
  CollapsibleTable,
  CollapsibleTableProps
} from '@renderer/common/components/collapsible-table'
import { SpravochnikSearchField } from '@renderer/common/features/search'
import {
  type TreeNode,
  buildTreeFromArray,
  sortElementsByLevels
} from '@renderer/common/lib/data-structure'

import { APIEndpoints, CRUDService } from '@/common/features/crud'
import { extendObject } from '@/common/lib/utils'

import { groupColumns } from './columns'

export const groupService = new CRUDService<Group, GroupPayloadType>({
  endpoint: APIEndpoints.jur7_group
})

type GroupTableProps = Omit<CollapsibleTableProps<TreeNode<Group>>, 'data'> & {
  data: Group[]
}
export const GroupTable = ({ data, ...props }: GroupTableProps) => {
  const treeData = useMemo(
    () =>
      buildTreeFromArray(
        data,
        (group) => group.pod_group,
        (array) => array.sort(sortElementsByLevels)
      ),
    [data]
  )
  return (
    <CollapsibleTable
      data={treeData}
      {...props}
    />
  )
}

export const createGroupSpravochnik = (config: Partial<SpravochnikHookOptions<Group>>) => {
  return extendObject(
    {
      title: 'Выберите группу',
      endpoint: APIEndpoints.jur7_group,
      columnDefs: groupColumns,
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
