import type { BankRasxod } from '@/common/models'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Trans } from 'react-i18next'

import { type ColumnDef, Copyable } from '@/common/components'
import { DataList } from '@/common/components/data-list'
import { HoverInfoCell } from '@/common/components/table/renderers'
import { IDCell } from '@/common/components/table/renderers/id'
import { ProvodkaCell } from '@/common/components/table/renderers/provodka-operatsii'
import { SummaCell } from '@/common/components/table/renderers/summa'
import { Switch } from '@/common/components/ui/switch'
import { formatLocaleDate } from '@/common/lib/format'

import { queryKeys } from './constants'
import { bankRasxodPaymentService } from './service'

export const rasxodColumns: ColumnDef<BankRasxod>[] = [
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
    minWidth: 200,
    numeric: true,
    key: 'summa',
    renderCell: (row) => {
      if (!row.tulangan_tulanmagan) {
        return (
          <div className="font-bold leading-tight">
            <div className="inline-block align-middle bg-yellow-200 px-0.5">
              <SummaCell summa={row.tulanmagan_summa} />
            </div>
          </div>
        )
      }
      return (
        <div className="font-bold">
          <SummaCell summa={row.summa} />
        </div>
      )
    }
  },
  {
    minWidth: 200,
    key: 'provodka',
    renderCell: (row) => <ProvodkaCell provodki={row.provodki_array ?? []} />
  },
  {
    fit: true,
    key: 'tulangan_tulanmagan',
    header: 'payed',
    renderCell: (row) => <StatusCell row={row} />
  },
  {
    fill: true,
    minWidth: 350,
    key: 'opisanie',
    className: 'max-w-md'
  }
]

const StatusCell = ({ row }: { row: BankRasxod }) => {
  const queryClient = useQueryClient()
  const { mutate: updateStatus, isPending } = useMutation({
    mutationFn: bankRasxodPaymentService.update,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
    }
  })

  return (
    <div className="flex items-center justify-center">
      <Switch
        loading={isPending}
        disabled={isPending}
        checked={row.tulangan_tulanmagan}
        onCheckedChange={(status) => {
          updateStatus({
            id: row.id,
            status
          })
        }}
      />
    </div>
  )
}
