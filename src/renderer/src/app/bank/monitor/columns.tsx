import type { BankMonitoringType } from '@/common/models'

import { DataList } from '@renderer/common/components/data-list'
import { IDCell } from '@renderer/common/components/table/renderers/id'
import { ProvodkaCell } from '@renderer/common/components/table/renderers/provodka'
import { Trans } from 'react-i18next'

import { type ColumnDef, Copyable } from '@/common/components'
import { HoverInfoCell } from '@/common/components/table/renderers'
import { formatLocaleDate } from '@/common/lib/format'

export const columns: ColumnDef<BankMonitoringType>[] = [
  {
    key: 'id',
    renderCell: IDCell
  },
  {
    key: 'doc_num'
  },
  {
    key: 'doc_date',
    renderCell(row, col) {
      return formatLocaleDate(row[col.key as keyof BankMonitoringType] as string)
    }
  },
  {
    key: 'id_spravochnik_organization',
    header: 'about-counteragent',
    className: 'w-96',
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
            list={[
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
    header: 'prixod',
    renderCell(row) {
      return !row.prixod_sum ? (
        '-'
      ) : (
        <ProvodkaCell
          summa={row.prixod_sum}
          provodki={row.provodki_array}
        />
      )
    }
  },
  {
    numeric: true,
    key: 'rasxod_sum',
    header: 'rasxod',
    renderCell(row) {
      return !row.rasxod_sum ? (
        '-'
      ) : (
        <ProvodkaCell
          summa={row.rasxod_sum}
          provodki={row.provodki_array}
        />
      )
    }
  },
  {
    key: 'opisanie'
  },
  {
    key: 'user_id',
    header: 'created-by-user',
    renderCell(row) {
      return `${row.fio} (@${row.login})`
    }
  }
]
