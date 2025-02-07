import type { BankRasxod } from '@renderer/common/models'

import { type ColumnDef } from '@renderer/common/components'
import { TooltipCell } from '@renderer/common/components/table/renderers'
import { ProvodkaCell } from '@renderer/common/components/table/renderers/provodka'
import { Switch } from '@renderer/common/components/ui/switch'
import { formatLocaleDate } from '@renderer/common/lib/format'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { queryKeys } from './constants'
import { bankRasxodPaymentService } from './service'

export const columns: ColumnDef<BankRasxod>[] = [
  {
    fit: true,
    key: 'doc_num'
  },
  {
    fit: true,
    key: 'doc_date',
    renderCell(row, col) {
      return formatLocaleDate(row[col.key as keyof BankRasxod] as string)
    }
  },
  {
    key: 'id_spravochnik_organization',
    header: 'about-counteragent',
    renderCell(row) {
      return (
        <TooltipCell
          data={row}
          description="spravochnik_organization_inn"
          title={row.spravochnik_organization_name ?? '-'}
          elements={{
            spravochnik_organization_inn: 'ИНН',
            spravochnik_organization_okonx: 'ОКОНХ',
            spravochnik_organization_bank_klient: 'Банк клиент',
            spravochnik_organization_raschet_schet: 'Расчет счет',
            spravochnik_organization_raschet_schet_gazna: 'Расчет счет Газна',
            spravochnik_organization_mfo: 'МФО'
          }}
        />
      )
    }
  },
  {
    numeric: true,
    key: 'summa',
    renderCell(row) {
      if (!row.tulangan_tulanmagan) {
        return (
          <div className="font-bold leading-tight">
            <div className="inline-block align-middle bg-yellow-200 px-0.5">
              <ProvodkaCell
                summa={row.tulanmagan_summa}
                schet={row.provodki_array?.[0]?.provodki_schet}
                sub_schet={row.provodki_array?.[0]?.provodki_sub_schet}
              />
            </div>
          </div>
        )
      }
      return (
        <div className="font-bold">
          <ProvodkaCell
            summa={row.summa}
            schet={row.provodki_array?.[0]?.provodki_schet}
            sub_schet={row.provodki_array?.[0]?.provodki_sub_schet}
          />
        </div>
      )
    }
  },
  {
    fit: true,
    key: 'tulangan_tulanmagan',
    header: 'payed',
    renderCell(row) {
      return <StatusCell row={row} />
    }
  },
  {
    key: 'opisanie',
    className: 'max-w-md'
  }
]

const StatusCell = ({ row }: { row: BankRasxod }) => {
  const queryClient = useQueryClient()
  const { mutate: updateStatus, isPending } = useMutation({
    mutationFn: bankRasxodPaymentService.update,
    onSuccess() {
      toast.success('Статус успешно обновлен')
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
    },
    onError() {
      toast.error('Ошибка при обновлении статуса')
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
