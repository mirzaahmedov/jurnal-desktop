import type { ColumnDef } from '@/common/components'
import type { WorkTrip } from '@/common/models'

import { Trans } from 'react-i18next'

import { DataList } from '@/common/components/data-list'
import { HoverInfoCell } from '@/common/components/table/renderers'
import { IDCell } from '@/common/components/table/renderers/id'
import { ProvodkaCell } from '@/common/components/table/renderers/provodka-operatsii'
import { SummaCell } from '@/common/components/table/renderers/summa'
import { formatLocaleDate } from '@/common/lib/format'

export const WorkTripColumnDefs: ColumnDef<WorkTrip>[] = [
  {
    key: 'id',
    renderCell: IDCell,
    width: 160,
    minWidth: 160
  },
  {
    minWidth: 160,
    key: 'doc_num'
  },
  {
    minWidth: 160,
    key: 'doc_date',
    renderCell: (row) => formatLocaleDate(row.doc_date)
  },
  {
    numeric: true,
    key: 'summa',
    renderCell: (row) => (
      <HoverInfoCell
        title={<SummaCell summa={row.summa} />}
        hoverContent={
          <DataList
            list={[
              {
                name: <Trans>day_summa</Trans>,
                value: row.day_summa
              },
              {
                name: <Trans>hotel_summa</Trans>,
                value: row.hostel_summa
              },
              {
                name: <Trans>hotel_number</Trans>,
                value: row.hostel_ticket_number
              },
              {
                name: <Trans>road_summa</Trans>,
                value: row.road_summa
              },
              {
                name: <Trans>road_ticket_number</Trans>,
                value: row.road_ticket_number
              }
            ]}
          />
        }
      />
    )
  },
  {
    minWidth: 220,
    key: 'date',
    renderCell: (row) => `${formatLocaleDate(row.from_date)} - ${formatLocaleDate(row.to_date)}`
  },
  {
    minWidth: 200,
    key: 'provodka',
    renderCell: (row) => <ProvodkaCell provodki={row.provodki_array} />
  },
  {
    minWidth: 220,
    key: 'podotchet-litso',
    renderCell: (row) => (
      <HoverInfoCell
        title={row.worker_name}
        secondaryText={row.worker_rayon}
        hoverContent={
          <DataList
            list={[
              {
                name: <Trans>id</Trans>,
                value: row.worker_id
              },
              {
                name: <Trans>name</Trans>,
                value: row.worker_name
              },
              {
                name: <Trans>rayon</Trans>,
                value: row.worker_rayon
              }
            ]}
          />
        }
      />
    )
  },
  {
    minWidth: 300,
    key: 'comment'
  }
]
