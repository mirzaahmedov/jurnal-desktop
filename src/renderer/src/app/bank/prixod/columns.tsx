import type { BankPrixodType } from '@/common/models'

import { DataList } from '@renderer/common/components/data-list'
import { IDCell } from '@renderer/common/components/table/renderers/id'
import { ProvodkaCell } from '@renderer/common/components/table/renderers/provodka'
import { Trans } from 'react-i18next'

import { type ColumnDef, Copyable } from '@/common/components'
import { HoverInfoCell } from '@/common/components/table/renderers'
import { formatLocaleDate } from '@/common/lib/format'

export const columns: ColumnDef<BankPrixodType>[] = [
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
      return formatLocaleDate(row[col.key as keyof BankPrixodType] as string)
    }
  },
  {
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
                name: <Trans>bank</Trans>,
                value: row.spravochnik_organization_bank_klient
              },
              {
                name: <Trans>okonx</Trans>,
                value: row.spravochnik_organization_okonx
              },
              {
                name: <Trans>inn</Trans>,
                value: row.spravochnik_organization_inn
              },
              {
                name: <Trans>raschet-schet</Trans>,
                value: row.spravochnik_organization_raschet_schet
              },
              {
                name: <Trans>raschet-schet-gazna</Trans>,
                value: row.spravochnik_organization_raschet_schet_gazna
              }
            ]}
          />
        }
      />
    )
  },
  {
    numeric: true,
    key: 'summa',
    renderCell(row) {
      return !row.summa ? (
        '-'
      ) : (
        <ProvodkaCell
          summa={row.summa}
          provodki={row.provodki_array}
        />
      )
    }
  },
  {
    key: 'opisanie'
  }
]
