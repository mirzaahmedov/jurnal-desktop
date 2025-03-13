import type { PodotchetOstatok } from '@/common/models'

import { DataList } from '@renderer/common/components/data-list'
import { IDCell } from '@renderer/common/components/table/renderers/id'
import { ProvodkaCell } from '@renderer/common/components/table/renderers/provodka'
import { Badge } from '@renderer/common/components/ui/badge'
import { Trans } from 'react-i18next'

import { type ColumnDef, Copyable } from '@/common/components'
import { HoverInfoCell } from '@/common/components/table/renderers'
import { formatLocaleDate } from '@/common/lib/format'

export const podotchetOstatokColumns: ColumnDef<PodotchetOstatok>[] = [
  {
    key: 'id',
    renderCell: IDCell
  },
  {
    key: 'doc_num'
  },
  {
    key: 'doc_date',
    renderCell: (row) => formatLocaleDate(row.doc_date)
  },
  {
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
    key: 'rasxod',
    header: 'type',
    renderCell: (row) =>
      row.rasxod ? (
        <Badge>
          <Trans>rasxod</Trans>
        </Badge>
      ) : (
        <Badge variant="outline">
          <Trans>prixod</Trans>
        </Badge>
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
    key: 'opisanie'
  }
]
