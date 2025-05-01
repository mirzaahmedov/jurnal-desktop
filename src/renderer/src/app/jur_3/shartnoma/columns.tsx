import type { Shartnoma } from '@/common/models'

import { Trans } from 'react-i18next'

import { type ColumnDef, Copyable } from '@/common/components'
import { DataList } from '@/common/components/data-list'
import { HoverInfoCell } from '@/common/components/table/renderers'
import { IDCell } from '@/common/components/table/renderers/id'
import { formatLocaleDate, formatNumber } from '@/common/lib/format'

const ShartnomaSmetaCell = (row: Shartnoma) => {
  return row.grafiks.map((g, i) => (
    <>
      {i !== 0 ? ', ' : null}
      <b className="leading-loose">{g.smeta?.smeta_number}</b>
    </>
  ))
}

export const ShartnomaColumns: ColumnDef<Shartnoma>[] = [
  {
    sort: true,
    width: 160,
    minWidth: 160,
    key: 'id',
    renderCell: IDCell
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
    header: 'about-counteragent',
    renderCell: (row) => (
      <HoverInfoCell
        title={row.organization?.name}
        secondaryText={<Copyable value={row.organization?.inn}>#{row.organization?.inn}</Copyable>}
        hoverContent={
          <DataList
            list={[
              {
                name: <Trans>id</Trans>,
                value: (
                  <Copyable
                    side="start"
                    value={row.organization?.id}
                  >
                    #{row.organization?.id}
                  </Copyable>
                )
              },
              {
                name: <Trans>name</Trans>,
                value: row.organization?.name
              },
              {
                name: <Trans>bank</Trans>,
                value: row.organization?.bank_klient
              },
              {
                name: <Trans>okonx</Trans>,
                value: row.organization?.okonx
              },
              {
                name: <Trans>inn</Trans>,
                value: row.organization?.inn
              }
            ]}
          />
        }
      />
    )
  },
  {
    fill: true,
    minWidth: 200,
    key: 'grafiks',
    header: 'smeta',
    renderCell: ShartnomaSmetaCell
  },
  {
    numeric: true,
    minWidth: 200,
    key: 'summa',
    renderCell: (row) => <b className="font-black">{formatNumber(Number(row.summa))}</b>
  },
  {
    fill: true,
    minWidth: 350,
    key: 'opisanie'
  }
]
