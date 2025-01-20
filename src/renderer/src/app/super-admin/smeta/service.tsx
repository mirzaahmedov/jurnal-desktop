import type { Smeta } from '@/common/models'
import type { SpravochnikHookOptions } from '@/common/features/spravochnik'
import type { SmetaForm } from './config'

import { APIEndpoints, CRUDService } from '@/common/features/crud'
import { extendObject } from '@/common/lib/utils'
import { smetaColumns } from './columns'
import { SpravochnikSearchField } from '@/common/features/search'
import {
  CollapsibleTable,
  CollapsibleTableProps
} from '@renderer/common/components/collapsible-table'
import { useMemo } from 'react'
import {
  buildTreeFromArray,
  sortElementsByLevels,
  type TreeNode
} from '@renderer/common/lib/data-structure'
import { SmetaGroupFilter } from './group-filter'

export const smetaService = new CRUDService<Smeta, SmetaForm>({
  endpoint: APIEndpoints.smeta
})

type SmetaTableProps = Omit<CollapsibleTableProps<TreeNode<Smeta>>, 'data'> & {
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
      data={treeData}
      columnDefs={columns}
      {...props}
    />
  )
}

const defaultFilters = {
  group_number: 1
}

export const createSmetaSpravochnik = (config: Partial<SpravochnikHookOptions<Smeta>>) => {
  return extendObject(
    {
      title: 'Выберите смету',
      endpoint: APIEndpoints.smeta,
      columnDefs: smetaColumns,
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
