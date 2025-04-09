import type { ColumnDef } from '@/common/components'
import type { Akt } from '@/common/models'

import { Trans } from 'react-i18next'

import { Copyable } from '@/common/components'
import { DataList } from '@/common/components/data-list'
import { HoverInfoCell } from '@/common/components/table/renderers'
import { IDCell } from '@/common/components/table/renderers/id'
import { ProvodkaCell } from '@/common/components/table/renderers/provodka-operatsii'
import { SummaCell } from '@/common/components/table/renderers/summa'
import { formatLocaleDate } from '@/common/lib/format'

export const AktColumns: ColumnDef<Akt>[] = [
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
    key: 'id_spravochnik_organization',
    header: 'organization',
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
    fit: true,
    key: 'shartnomalar_organization_id',
    header: 'shartnoma',
    renderCell: (row) =>
      row.shartnomalar_organization_id ? (
        <HoverInfoCell
          title={`№ ${row.shartnomalar_organization_doc_num}`}
          secondaryText={formatLocaleDate(row.shartnomalar_organization_doc_date)}
          hoverContent={
            <DataList
              list={[
                {
                  name: <Trans>id</Trans>,
                  value: (
                    <Copyable
                      side="start"
                      value={row.shartnomalar_organization_id}
                    >
                      #{row.shartnomalar_organization_id}
                    </Copyable>
                  )
                },
                {
                  name: <Trans>doc_date</Trans>,
                  value: row.shartnomalar_organization_doc_date
                },
                {
                  name: <Trans>doc_num</Trans>,
                  value: formatLocaleDate(row.shartnomalar_organization_doc_num)
                }
              ]}
            />
          }
        />
      ) : undefined
  },
  {
    numeric: true,
    minWidth: 200,
    key: 'summa',
    renderCell: (row) => <SummaCell summa={row.summa} />
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
