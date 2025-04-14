import type { ColumnDef } from '@/common/components'
import type { MainSchet } from '@/common/models'

import { Trans } from 'react-i18next'

import { DataList } from '@/common/components/data-list'
import { HoverInfoCell } from '@/common/components/table/renderers'
import { IDCell } from '@/common/components/table/renderers/id'

export const MainSchetColumns: ColumnDef<MainSchet>[] = [
  {
    key: 'id',
    minWidth: 120,
    width: 120,
    renderCell: IDCell
  },
  {
    minWidth: 300,
    key: 'account_name',
    header: 'name'
  },
  {
    minWidth: 200,
    key: 'account_number',
    header: 'raschet-schet'
  },
  {
    minWidth: 200,
    key: 'gazna_number',
    header: 'raschet-schet-gazna'
  },

  {
    minWidth: 300,
    key: 'schet',
    renderCell: (row) => {
      return (
        <DataList
          list={[
            {
              name: <Trans values={{ nth: 1 }}>mo-nth</Trans>,
              value: row.jur1_schet
            },
            {
              name: <Trans values={{ nth: 2 }}>mo-nth</Trans>,
              value: row.jur2_schet
            },
            {
              name: <Trans values={{ nth: '3-152' }}>mo-nth</Trans>,
              value: row.jur3_schets_152.map((o) => o.schet).join(', ')
            },
            {
              name: <Trans values={{ nth: '3-159' }}>mo-nth</Trans>,
              value: row.jur3_schets_159.map((o) => o.schet).join(', ')
            },
            {
              name: <Trans values={{ nth: 4 }}>mo-nth</Trans>,
              value: row.jur4_schet
            }
          ]}
        />
      )
    }
  },
  {
    minWidth: 350,
    key: 'tashkilot_inn',
    header: 'organization',
    renderCell: (row) => {
      return (
        <HoverInfoCell
          title={row.tashkilot_nomi}
          secondaryText={row.tashkilot_inn}
          hoverContent={
            <DataList
              list={[
                {
                  name: <Trans>name</Trans>,
                  value: row.tashkilot_nomi
                },
                {
                  name: <Trans>inn</Trans>,
                  value: row.tashkilot_inn
                },
                {
                  name: <Trans>bank</Trans>,
                  value: row.tashkilot_bank
                },
                {
                  name: <Trans>mfo</Trans>,
                  value: row.tashkilot_mfo
                }
              ]}
            />
          }
        />
      )
    }
  },
  {
    minWidth: 200,
    key: 'budjet_name',
    header: 'budjet'
  }
]
