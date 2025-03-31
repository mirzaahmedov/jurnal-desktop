import type { SmetaForm } from './config'
import type { SpravochnikHookOptions } from '@/common/features/spravochnik'
import type { Smeta } from '@/common/models'

import { useMemo } from 'react'

import {
  CollapsibleTable,
  type CollapsibleTableProps
} from '@renderer/common/components/collapsible-table'
import { SpravochnikSearchField } from '@renderer/common/features/filters/search/search-filter-spravochnik'
import {
  type PathTreeNode,
  arrayToTreeByPathKey,
  sortElementsByPath
} from '@renderer/common/lib/tree/path-tree'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { extendObject } from '@/common/lib/utils'

import { smetaColumns } from './columns'
import { SmetaGroupFilter } from './filter'

export const smetaService = new CRUDService<Smeta, SmetaForm>({
  endpoint: ApiEndpoints.smeta
}).forRequest((type, ctx) => {
  if (type === 'getAll') {
    const params = ctx.config.params ?? {}
    if (params.group_number === 'all') {
      delete params.group_number
    }
    return {
      config: {
        ...ctx.config,
        params: {
          ...ctx.config.params,
          ...params
        }
      }
    }
  }
  return {}
})

type SmetaTableProps = Omit<
  CollapsibleTableProps<PathTreeNode<Smeta>, PathTreeNode<Smeta>>,
  'data' | 'getChildRows' | 'getRowId'
> & {
  data: Smeta[]
}
export const SmetaTable = ({ data, columnDefs: columns, ...props }: SmetaTableProps) => {
  const treeData = useMemo(
    () =>
      arrayToTreeByPathKey({
        array: data,
        getPathKey: (smeta) => smeta.father_smeta_name,
        preprocessors: [(array) => array.sort(sortElementsByPath)]
      }),
    [data]
  )

  return (
    <CollapsibleTable
      getRowId={(row) => row.id}
      getChildRows={(row) => row.children}
      data={treeData}
      columnDefs={columns}
      {...props}
    />
  )
}

const defaultFilters = {
  group_number: 'all'
}

export const createSmetaSpravochnik = (
  config: Partial<SpravochnikHookOptions<PathTreeNode<Smeta>>>
) => {
  return extendObject(
    {
      title: 'Выберите смету',
      endpoint: ApiEndpoints.smeta,
      columnDefs: smetaColumns,
      // Todo: fix this
      // @ts-expect-error fix this later
      service: smetaService,
      filters: [SpravochnikSearchField, SmetaGroupFilter],
      defaultFilters,
      params: extendObject(
        {
          page: 1,
          limit: 100000
        },
        config.params ?? {}
      ),
      CustomTable: SmetaTable
    } satisfies typeof config,
    config
  )
}
