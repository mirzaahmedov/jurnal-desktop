import { type ColumnDef, Copyable } from '@renderer/common/components'
import { DataList } from '@renderer/common/components/data-list'
import { ProvodkaBadge } from '@renderer/common/components/provodka-badge'
import { HoverInfoCell } from '@renderer/common/components/table/renderers'
import { IDCell } from '@renderer/common/components/table/renderers/id'
import { ProvodkaCell } from '@renderer/common/components/table/renderers/provodka'
import { formatLocaleDate } from '@renderer/common/lib/format'
import { Trans } from 'react-i18next'

import { type OrganizationMonitor } from '@/common/models'

export const organizationMonitorColumns: ColumnDef<OrganizationMonitor>[] = [
  {
    key: 'id',
    renderCell: IDCell,
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
    minWidth: 300,
    key: 'organ_name',
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
        hoverContent={
          <DataList
            list={[
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
    key: 'summa_prixod',
    header: 'debet',
    renderCell(row) {
      return !row.summa_prixod ? (
        '-'
      ) : (
        <ProvodkaCell
          summa={row.summa_prixod}
          provodki={[
            {
              provodki_schet: row.provodki_schet,
              provodki_sub_schet: row.provodki_sub_schet
            }
          ]}
        />
      )
    }
  },
  {
    numeric: true,
    key: 'summa_rasxod',
    header: 'kredit',
    renderCell(row) {
      return !row.summa_rasxod ? (
        '-'
      ) : (
        <ProvodkaCell
          summa={row.summa_rasxod}
          provodki={[
            {
              provodki_schet: row.provodki_schet,
              provodki_sub_schet: row.provodki_sub_schet
            }
          ]}
        />
      )
    }
  },

  {
    minWidth: 300,
    key: 'opisanie',
    className: 'max-w-md'
  },
  {
    fit: true,
    key: 'type',
    header: 'type-operatsii',
    renderCell: (row) => <ProvodkaBadge type={row.type} />
  },
  {
    fit: true,
    key: 'user_id',
    header: 'created-by-user',
    renderCell: (row) => `${row.fio} (@${row.login})`
  }
]
