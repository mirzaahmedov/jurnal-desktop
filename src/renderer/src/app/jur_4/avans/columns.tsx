import type { Avans } from '@/common/models'

import { Trans } from 'react-i18next'

import { type ColumnDef, Copyable } from '@/common/components'
import { DataList } from '@/common/components/data-list'
import { HoverInfoCell } from '@/common/components/table/renderers'
import { IDCell } from '@/common/components/table/renderers/id'
import { ProvodkaCell } from '@/common/components/table/renderers/provodka-operatsii'
import { SummaCell } from '@/common/components/table/renderers/summa'
import { UserCell } from '@/common/components/table/renderers/user'
import { formatLocaleDate } from '@/common/lib/format'

export const avansColumns: ColumnDef<Avans>[] = [
  {
    sort: true,
    key: 'id',
    renderCell: IDCell,
    width: 160,
    minWidth: 160
  },
  {
    sort: true,
    fit: true,
    minWidth: 200,
    key: 'doc_num'
  },
  {
    sort: true,
    fit: true,
    minWidth: 200,
    key: 'doc_date',
    renderCell: (row) => formatLocaleDate(row.doc_date)
  },
  {
    fill: true,
    minWidth: 350,
    key: 'spravochnik_podotchet_litso_id',
    header: 'podotchet-litso',
    renderCell: (row) => (
      <HoverInfoCell
        title={row.spravochnik_podotchet_litso_name}
        secondaryText={row.spravochnik_podotchet_litso_rayon}
        tooltipContent={
          <DataList
            items={[
              {
                name: <Trans>id</Trans>,
                value: (
                  <Copyable
                    side="start"
                    value={row.spravochnik_operatsii_own_id}
                  >
                    #{row.spravochnik_operatsii_own_id}
                  </Copyable>
                )
              },
              {
                name: <Trans>name</Trans>,
                value: row.spravochnik_podotchet_litso_name
              },
              {
                name: <Trans>rayon</Trans>,
                value: row.spravochnik_podotchet_litso_rayon
              }
            ]}
          />
        }
      />
    )
  },
  {
    numeric: true,
    minWidth: 200,
    key: 'summa',
    renderCell: (row) => <SummaCell summa={row.summa} />
  },
  {
    minWidth: 200,
    key: 'provodka',
    renderCell: (row) => <ProvodkaCell provodki={row.provodki_array} />
  },
  {
    fill: true,
    minWidth: 350,
    key: 'opisanie'
  },
  {
    fit: true,
    key: 'user_id',
    minWidth: 200,
    header: 'created-by-user',
    renderCell: (row) => (
      <UserCell
        id={row.user_id}
        fio={row.fio}
        login={row.login}
      />
    )
  }
]
