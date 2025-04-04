import { Trans } from 'react-i18next'

import { type ColumnDef, Copyable } from '@/common/components'
import { DataList } from '@/common/components/data-list'
import { HoverInfoCell } from '@/common/components/table/renderers'
import { IDCell } from '@/common/components/table/renderers/id'
import { ProvodkaCell } from '@/common/components/table/renderers/provodka-operatsii'
import { SummaCell } from '@/common/components/table/renderers/summa'
import { formatLocaleDate } from '@/common/lib/format'
import { type OrganizationOstatok } from '@/common/models'

export const organOstatokColumns: ColumnDef<OrganizationOstatok>[] = [
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
    key: 'organ_id',
    header: 'organization',
    renderCell: (row) => (
      <HoverInfoCell
        title={row.organ_name}
        secondaryText={<Copyable value={row.organ_inn}>#{row.organ_inn}</Copyable>}
        hoverContent={
          <DataList
            list={[
              {
                name: <Trans>id</Trans>,
                value: (
                  <Copyable
                    side="start"
                    value={row.organ_id}
                  >
                    #{row.organ_id}
                  </Copyable>
                )
              },
              {
                name: <Trans>name</Trans>,
                value: row.organ_name
              },
              {
                name: <Trans>inn</Trans>,
                value: row.organ_inn
              },
              {
                name: <Trans>bank</Trans>,
                value: row.organ_bank_name
              },
              {
                name: <Trans>mfo</Trans>,
                value: row.organ_bank_mfo
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
    header: 'prixod',
    key: 'prixod_summa',
    renderCell: (row) => (!row.prixod_summa ? '-' : <SummaCell summa={row.prixod_summa} />)
  },
  {
    numeric: true,
    minWidth: 200,
    header: 'rasxod',
    key: 'rasxod_summa',
    renderCell: (row) => (!row.rasxod_summa ? '-' : <SummaCell summa={row.rasxod_summa} />)
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
  }
]
