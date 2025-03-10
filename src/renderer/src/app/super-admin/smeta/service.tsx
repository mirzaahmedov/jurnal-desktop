import type { SmetaForm } from './config'
import type { SpravochnikHookOptions } from '@/common/features/spravochnik'
import type { Smeta } from '@/common/models'

import { useMemo } from 'react'

import {
  CollapsibleTable,
  type CollapsibleTableProps
} from '@renderer/common/components/collapsible-table'
import {
  type TreeNode,
  buildTreeFromArray,
  sortElementsByLevels
} from '@renderer/common/lib/data-structure'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { SpravochnikSearchField } from '@/common/features/search'
import { extendObject } from '@/common/lib/utils'

import { smetaColumns } from './columns'
import { SmetaGroupFilter } from './group-filter'

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
  CollapsibleTableProps<TreeNode<Smeta>, TreeNode<Smeta>>,
  'data' | 'getChildRows' | 'getRowId'
> & {
  data: Smeta[]
}
export const SmetaTable = ({ data, columnDefs: columns, ...props }: SmetaTableProps) => {
  const treeData = useMemo(
    () =>
      buildTreeFromArray(
        data,
        (smeta) => smeta.father_smeta_name,
        (array) => array.sort(sortElementsByLevels)
      ),
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
  config: Partial<SpravochnikHookOptions<TreeNode<Smeta>>>
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
