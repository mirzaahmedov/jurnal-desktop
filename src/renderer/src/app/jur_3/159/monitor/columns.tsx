import { Trans } from 'react-i18next'

import { type ColumnDef, Copyable } from '@/common/components'
import { DataList } from '@/common/components/data-list'
import { ProvodkaBadge } from '@/common/components/provodka-badge'
import { HoverInfoCell } from '@/common/components/table/renderers'
import { IDCell } from '@/common/components/table/renderers/id'
import { ProvodkaCell } from '@/common/components/table/renderers/provodka-operatsii'
import { SummaCell } from '@/common/components/table/renderers/summa'
import { UserCell } from '@/common/components/table/renderers/user'
import { formatLocaleDate } from '@/common/lib/format'
import { type OrganizationMonitor } from '@/common/models'

export const OrganMonitorColumns: ColumnDef<OrganizationMonitor>[] = [
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
    key: 'organ_name',
    header: 'organization',
    renderCell: (row) => (
      <HoverInfoCell
        title={row.organ_name}
        secondaryText={<Copyable value={row.organ_inn}>#{row.organ_inn}</Copyable>}
        tooltipContent={
          <DataList
            items={[
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
              }
            ]}
          />
        }
      />
    )
  },
  {
    fit: true,
    key: 'shartnoma_id',
    header: 'shartnoma',
    renderCell: (row) => (
      <HoverInfoCell
        title={
          row.shartnoma_id ? (
            <Copyable value={row.shartnoma_doc_num}>№ {row.shartnoma_doc_num}</Copyable>
          ) : undefined
        }
        secondaryText={formatLocaleDate(row.shartnoma_doc_date)}
        tooltipContent={
          <DataList
            items={[
              {
                name: <Trans>id</Trans>,
                value: (
                  <Copyable
                    side="start"
                    value={row.shartnoma_id}
                  >
                    #{row.shartnoma_id}
                  </Copyable>
                )
              },
              {
                name: <Trans>doc_num</Trans>,
                value: row.shartnoma_doc_num
              },
              {
                name: <Trans>doc_date</Trans>,
                value: row.shartnoma_doc_date
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
    key: 'summa_prixod',
    header: 'debet',
    renderCell(row) {
      return !row.summa_prixod ? '-' : <SummaCell summa={row.summa_prixod} />
    }
  },
  {
    numeric: true,
    minWidth: 200,
    key: 'summa_rasxod',
    header: 'kredit',
    renderCell(row) {
      return !row.summa_rasxod ? '-' : <SummaCell summa={row.summa_rasxod} />
    }
  },
  {
    minWidth: 200,
    key: 'provodka',
    renderCell: (row) => (
      <ProvodkaCell
        provodki={[
          {
            provodki_schet: row.provodki_schet,
            provodki_sub_schet: row.provodki_sub_schet
          }
        ]}
      />
    )
  },
  {
    fit: true,
    key: 'type',
    header: 'type-operatsii',
    renderCell: (row) => <ProvodkaBadge type={row.type} />
  },
  {
    fill: true,
    minWidth: 350,
    key: 'opisanie',
    className: 'max-w-md'
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
