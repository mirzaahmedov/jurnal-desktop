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
import { treeFromArray } from './utils'
import { SmetaGroupFilter } from './group-filter'

export const smetaService = new CRUDService<Smeta, SmetaForm>({
  endpoint: APIEndpoints.smeta
})

export const SmetaTable = ({ data, columns, ...props }: CollapsibleTableProps<any>) => {
  const nested = useMemo(() => treeFromArray(data), [data])
  return (
    <CollapsibleTable
      data={nested}
      columns={columns}
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
      columns: smetaColumns,
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
