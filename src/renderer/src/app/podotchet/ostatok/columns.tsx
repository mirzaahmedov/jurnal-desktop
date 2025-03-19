import { DataList } from '@renderer/common/components/data-list'
import { ProvodkaBadge } from '@renderer/common/components/provodka-badge'
import { IDCell } from '@renderer/common/components/table/renderers/id'
import { ProvodkaCell } from '@renderer/common/components/table/renderers/provodka'
import { Trans } from 'react-i18next'

import { type ColumnDef, Copyable } from '@/common/components'
import { HoverInfoCell } from '@/common/components/table/renderers'
import { formatLocaleDate } from '@/common/lib/format'
import { type PodotchetOstatok, ProvodkaType } from '@/common/models'

export const podotchetOstatokColumns: ColumnDef<PodotchetOstatok>[] = [
  {
    key: 'id',
    renderCell: IDCell,
    width: 160,
    minWidth: 160
  },
  {
    fit: true,
    key: 'doc_num'
  },
  {
    fit: true,
    key: 'doc_date',
    renderCell: (row) => formatLocaleDate(row.doc_date)
  },
  {
    width: 350,
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
    fit: true,
    key: 'rasxod',
    header: 'type',
    renderCell: (row) => (
      <ProvodkaBadge
        type={
          row.rasxod ? ProvodkaType.PODOTCHET_SALDO_RASXOD : ProvodkaType.PODOTCHET_SALDO_PRIXOD
        }
      />
    )
  },
  {
    numeric: true,
    key: 'summa',
    renderCell: (row) => (
      <ProvodkaCell
        summa={row.prixod ? row.prixod_summa : row.rasxod_summa}
        provodki={row.provodki_array}
      />
    )
  },
  {
    width: 350,
    key: 'opisanie'
  }
]
