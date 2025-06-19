import type { ColumnDef } from '@/common/components'
import type { Operatsii } from '@/common/models'

import { Trans } from 'react-i18next'

import { IDCell } from '@/common/components/table/renderers/id'

import { operatsiiTypeSchetOptions } from './config'

export const OperatsiiColumns: ColumnDef<Operatsii>[] = [
  {
    key: 'id',
    renderCell: IDCell,
    width: 160,
    minWidth: 160
  },
  {
    key: 'name',
    width: '100%'
  },
  {
    key: 'schet',
    width: 140,
    minWidth: 140
  },
  {
    key: 'type_schet',
    width: 260,
    minWidth: 260,
    renderCell: (row) => (
      <Trans
        ns="app"
        i18nKey={operatsiiTypeSchetOptions.find((o) => o.value === row.type_schet)?.transKey ?? '-'}
      />
    )
  },
  {
    key: 'sub_schet',
    width: 140,
    minWidth: 140,
    header: 'subschet'
  }
]
