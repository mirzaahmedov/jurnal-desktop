import { DataList } from '@renderer/common/components/data-list'
import { ProvodkaBadge } from '@renderer/common/components/provodka-badge'
import { IDCell } from '@renderer/common/components/table/renderers/id'
import { ProvodkaCell } from '@renderer/common/components/table/renderers/provodka'
import { Trans } from 'react-i18next'

import { type ColumnDef, Copyable } from '@/common/components'
import { HoverInfoCell } from '@/common/components/table/renderers'
import { formatLocaleDate } from '@/common/lib/format'
import { type OrganizationOstatok, ProvodkaType } from '@/common/models'

export const organOstatokColumns: ColumnDef<OrganizationOstatok>[] = [
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
    key: 'rasxod',
    header: 'type',
    renderCell: (row) => (
      <ProvodkaBadge
        type={row.rasxod ? ProvodkaType.ORGAN_SALDO_RASXOD : ProvodkaType.ORGAN_SALDO_PRIXOD}
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
    key: 'opisanie'
  }
]
