import { DataList } from '@renderer/common/components/data-list'
import { IDCell } from '@renderer/common/components/table/renderers/id'
import { ProvodkaCell } from '@renderer/common/components/table/renderers/provodka'
import { Trans } from 'react-i18next'

import { type ColumnDef, Copyable } from '@/common/components'
import { HoverInfoCell } from '@/common/components/table/renderers'
import { formatLocaleDate } from '@/common/lib/format'
import { type OrganizationOstatok } from '@/common/models'

export const organOstatokColumns: ColumnDef<OrganizationOstatok>[] = [
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
    header: 'prixod',
    key: 'prixod_summa',
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
    header: 'rasxod',
    key: 'rasxod_summa',
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
    width: 350,
    key: 'opisanie'
  }
]
