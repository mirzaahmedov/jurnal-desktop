import type { GroupFormValues } from './config'
import type { SpravochnikHookOptions } from '@/common/features/spravochnik'
import type { Group } from '@/common/models'

import { useMemo } from 'react'

import { t } from 'i18next'

import { CollapsibleTable, type CollapsibleTableProps } from '@/common/components/collapsible-table'
import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { SpravochnikSearchField } from '@/common/features/filters/search/search-filter-spravochnik'
import {
  type PathTreeNode,
  arrayToTreeByPathKey,
  sortElementsByPath
} from '@/common/lib/tree/path-tree'
import { extendObject } from '@/common/lib/utils'

import { GroupColumns } from './columns'

export const GroupService = new CRUDService<Group, GroupFormValues>({
  endpoint: ApiEndpoints.jur7_group
})

type GroupTableProps = Omit<
  CollapsibleTableProps<PathTreeNode<Group>, PathTreeNode<Group>>,
  'data' | 'getRowId' | 'getChildRows' | 'children'
> & {
  data: Group[]
}
export const GroupTable = ({ data, ...props }: GroupTableProps) => {
  const treeData = useMemo(
    () =>
      arrayToTreeByPathKey({
        array: data,
        getPathKey: (group) => group.pod_group,
        preprocessors: [(array) => array.sort(sortElementsByPath)]
      }),
    [data]
  )
  return (
    <CollapsibleTable
      data={treeData}
      getRowId={(row) => row.id}
      getChildRows={(row) => row.children as any}
      {...props}
    />
  )
}

export const createGroupSpravochnik = (config: Partial<SpravochnikHookOptions<Group>>) => {
  const params = extendObject(
    {
      page: 1,
      limit: 100000
    },
    config.params ?? {}
  )
  return extendObject(
    {
      title: t('group'),
      endpoint: ApiEndpoints.jur7_group,
      columnDefs: GroupColumns as any, // Todo: fix this
      service: GroupService,
      filters: [SpravochnikSearchField],
      CustomTable: GroupTable as any, // Todo: fix this
      pagination: false,
      params
    } satisfies typeof config,
    config
  )
}
