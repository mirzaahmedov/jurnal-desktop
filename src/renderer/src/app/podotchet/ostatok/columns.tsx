import { DataList } from '@renderer/common/components/data-list'
import { IDCell } from '@renderer/common/components/table/renderers/id'
import { ProvodkaCell } from '@renderer/common/components/table/renderers/provodka'
import { Trans } from 'react-i18next'

import { type ColumnDef, Copyable } from '@/common/components'
import { HoverInfoCell } from '@/common/components/table/renderers'
import { formatLocaleDate } from '@/common/lib/format'
import { type PodotchetOstatok } from '@/common/models'

export const podotchetOstatokColumns: ColumnDef<PodotchetOstatok>[] = [
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
    key: 'podotchet_id',
    header: 'organization',
    renderCell: (row) => (
      <HoverInfoCell
        title={row.podotchet_name}
        secondaryText={row.podotchet_rayon}
        hoverContent={
          <DataList
            list={[
              {
                name: <Trans>id</Trans>,
                value: (
                  <Copyable
                    side="start"
                    value={row.podotchet_id}
                  >
                    #{row.podotchet_id}
                  </Copyable>
                )
              },
              {
                name: <Trans>name</Trans>,
                value: row.podotchet_name
              },
              {
                name: <Trans>rayon</Trans>,
                value: row.podotchet_rayon
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
    key: 'prixod_summa',
    header: 'prixod',
    renderCell: (row) =>
      !row.prixod_summa ? (
        '-'
      ) : (
        <ProvodkaCell
          summa={row.prixod_summa}
          provodki={row.provodki_array}
        />
      )
  },
  {
    numeric: true,
    minWidth: 200,
    key: 'rasxod_summa',
    header: 'rasxod',
    renderCell: (row) =>
      !row.rasxod_summa ? (
        '-'
      ) : (
        <ProvodkaCell
          summa={row.rasxod_summa}
          provodki={row.provodki_array}
        />
      )
  },
  {
    fill: true,
    minWidth: 350,
    key: 'opisanie'
  }
]
