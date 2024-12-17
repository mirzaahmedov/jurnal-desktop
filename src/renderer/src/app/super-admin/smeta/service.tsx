import type { Smeta } from '@/common/models'
import type { SpravochnikHookOptions } from '@/common/features/spravochnik'
import type { SmetaForm } from './config'

import { ApiEndpoints, CRUDService } from '@/common/features/crud'
import { extendObject } from '@/common/lib/utils'
import { smetaColumns } from './columns'
import { SpravochnikSearchField } from '@/common/features/search'
import { CollapsibleTable } from '@renderer/common/components/collapsible-table'
import { useMemo } from 'react'
import { groupNestedList } from '@renderer/common/lib/array'

export const smetaService = new CRUDService<Smeta, SmetaForm>({
  endpoint: ApiEndpoints.smeta
})

const renderSmetaTable: SpravochnikHookOptions<Smeta>['renderTable'] = ({
  data,
  columns,
  onClickRow
}) => {
  const nested = useMemo(() => groupNestedList(data, 'father_smeta_name'), [data])
  return <CollapsibleTable data={nested} columns={columns} />
}

export const createSmetaSpravochnik = (config: Partial<SpravochnikHookOptions<Smeta>>) => {
  return extendObject(
    {
      title: 'Выберите смету',
      endpoint: ApiEndpoints.smeta,
      columns: smetaColumns,
      service: smetaService,
      filters: [SpravochnikSearchField],
      renderTable: renderSmetaTable
    } satisfies typeof config,
    config
  )
}
