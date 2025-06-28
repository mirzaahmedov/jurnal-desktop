import type { BankMonitoringType } from '@/common/models'

import { Trans } from 'react-i18next'

import { type ColumnDef, Copyable } from '@/common/components'
import { DataList } from '@/common/components/data-list'
import { HoverInfoCell } from '@/common/components/table/renderers'
import { IDCell } from '@/common/components/table/renderers/id'
import { ProvodkaCell } from '@/common/components/table/renderers/provodka-operatsii'
import { SummaCell } from '@/common/components/table/renderers/summa'
import { UserCell } from '@/common/components/table/renderers/user'
import { formatLocaleDate } from '@/common/lib/format'

export const BankMonitorColumns: ColumnDef<BankMonitoringType>[] = [
  {
    sort: true,
    key: 'id',
    renderCell: IDCell,
    width: 160,
    minWidth: 160
  },
  {
    fit: true,
    sort: true,
    minWidth: 200,
    key: 'doc_num'
  },
  {
    fit: true,
    sort: true,
    minWidth: 200,
    key: 'doc_date',
    renderCell: (row) => formatLocaleDate(row.doc_date)
  },
  {
    fill: true,
    minWidth: 350,
    key: 'id_spravochnik_organization',
    header: 'about-counteragent',
    renderCell: (row) => (
      <HoverInfoCell
        title={row.spravochnik_organization_name}
        secondaryText={
          <Copyable value={row.spravochnik_organization_inn}>
            #{row.spravochnik_organization_inn}
          </Copyable>
        }
        hoverContent={
          <DataList
            items={[
              {
                name: <Trans>id</Trans>,
                value: (
                  <Copyable
                    side="start"
                    value={row.id_spravochnik_organization}
                  >
                    #{row.id_spravochnik_organization}
                  </Copyable>
                )
              },
              {
                name: <Trans>name</Trans>,
                value: row.spravochnik_organization_name
              },
              {
                name: <Trans>inn</Trans>,
                value: row.spravochnik_organization_inn
              },
              {
                name: <Trans>raschet-schet</Trans>,
                value: row.spravochnik_organization_raschet_schet
              }
            ]}
          />
        }
      />
    )
  },
  {
    numeric: true,
    key: 'prixod_sum',
    minWidth: 200,
    header: 'prixod',
    renderCell: (row) => (!row.prixod_sum ? '-' : <SummaCell summa={row.prixod_sum} />)
  },
  {
    numeric: true,
    key: 'rasxod_sum',
    minWidth: 200,
    header: 'rasxod',
    renderCell: (row) => (!row.rasxod_sum ? '-' : <SummaCell summa={row.rasxod_sum} />)
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
