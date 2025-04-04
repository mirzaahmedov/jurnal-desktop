import type { ColumnDef } from '@/common/components'
import type { MainSchet } from '@/common/models'

import { Trans } from 'react-i18next'

import { DataList } from '@/common/components/data-list'
import { HoverInfoCell } from '@/common/components/table/renderers'
import { IDCell } from '@/common/components/table/renderers/id'

export const mainSchetColumns: ColumnDef<MainSchet>[] = [
  {
    key: 'id',
    renderCell: IDCell
  },
  {
    key: 'account_name',
    header: 'name'
  },
  {
    key: 'account_number',
    header: 'raschet-schet'
  },
  {
    key: 'gazna_number',
    header: 'raschet-schet-gazna'
  },
  {
    key: 'tashkilot_inn',
    header: 'organization',
    renderCell(row) {
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
    key: 'budjet_name',
    header: 'budjet'
  }
]
