import type { Avans } from '@/common/models'

import { DataList } from '@renderer/common/components/data-list'
import { HoverInfoCell } from '@renderer/common/components/table/renderers'
import { IDCell } from '@renderer/common/components/table/renderers/id'
import { ProvodkaCell } from '@renderer/common/components/table/renderers/provodka'
import { ProvodkaOperatsiiCell } from '@renderer/common/components/table/renderers/provodka-operatsii'
import { formatLocaleDate } from '@renderer/common/lib/format'
import { Trans } from 'react-i18next'

import { type ColumnDef, Copyable } from '@/common/components'

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
        hoverContent={
          <DataList
            list={[
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
    renderCell: (row) => (
      <ProvodkaCell
        summa={row.summa}
        provodki={row.provodki_array}
      />
    )
  },
  {
    minWidth: 200,
    key: 'provodka',
    renderCell: (row) => <ProvodkaOperatsiiCell provodki={row.provodki_array} />
  },
  {
    fill: true,
    minWidth: 350,
    key: 'opisanie'
  }
]
