import type { SmetaForm } from './config'
import type { SpravochnikHookOptions } from '@/common/features/spravochnik'
import type { ApiResponse, Smeta } from '@/common/models'

import { useMemo } from 'react'

import { CollapsibleTable, type CollapsibleTableProps } from '@/common/components/collapsible-table'
import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { SpravochnikSearchField } from '@/common/features/filters/search/search-filter-spravochnik'
import {
  type PathTreeNode,
  arrayToTreeByPathKey,
  sortElementsByPath
} from '@/common/lib/tree/path-tree'
import { extendObject } from '@/common/lib/utils'

import { SmetaColumns } from './columns'
import { SmetaGroupFilter } from './filter'

export interface SmetaNumberOption {
  smeta_number: string
  smeta_name: string
}

export class SmetaCRUDService extends CRUDService<Smeta, SmetaForm> {
  constructor() {
    super({
      endpoint: ApiEndpoints.smeta
    })

    this.getSmetaNumbers = this.getSmetaNumbers.bind(this)
  }

  async getSmetaNumbers() {
    const response = await this.client.get<ApiResponse<SmetaNumberOption[]>>('/smeta/smeta-number')
    return response.data
  }
}

export const smetaService = new SmetaCRUDService().forRequest((type, ctx) => {
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

interface SmetaTableProps
  extends Omit<
    CollapsibleTableProps<PathTreeNode<Smeta>, PathTreeNode<Smeta>>,
    'data' | 'getChildRows' | 'getRowId'
  > {
  data: Smeta[]
}
export const SmetaTable = ({ data, ...props }: SmetaTableProps) => {
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
      getChildRows={(row) => row.children ?? []}
      data={treeData}
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
      columnDefs: SmetaColumns,
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
