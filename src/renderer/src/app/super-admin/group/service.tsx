import type { GroupPayloadType } from './constants'
import type { SpravochnikHookOptions } from '@/common/features/spravochnik'
import type { Group } from '@/common/models'

import { useMemo } from 'react'

import {
  CollapsibleTable,
  type CollapsibleTableProps
} from '@renderer/common/components/collapsible-table'
import { SpravochnikSearchField } from '@renderer/common/features/search'
import {
  type TreeNode,
  buildTreeFromArray,
  sortElementsByLevels
} from '@renderer/common/lib/data-structure'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { extendObject } from '@/common/lib/utils'

import { groupColumns } from './columns'

export const groupService = new CRUDService<Group, GroupPayloadType>({
  endpoint: ApiEndpoints.jur7_group
})

type GroupTableProps = Omit<
  CollapsibleTableProps<TreeNode<Group>, TreeNode<Group>>,
  'data' | 'getRowId' | 'getChildRows'
> & {
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
      getRowId={(row) => row.id}
      getChildRows={(row) => row.children}
      {...props}
    />
  )
}

export const createGroupSpravochnik = (config: Partial<SpravochnikHookOptions<Group>>) => {
  return extendObject(
    {
      title: 'Выберите группу',
      endpoint: ApiEndpoints.jur7_group,
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
