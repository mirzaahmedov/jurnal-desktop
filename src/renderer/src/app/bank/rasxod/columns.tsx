import { type ColumnDef } from '@renderer/common/components'
import { TooltipCellRenderer } from '@renderer/common/components/table/renderers'
import { Switch } from '@renderer/common/components/ui/switch'
import { toast } from 'react-toastify'
import { formatLocaleDate, formatNumber } from '@renderer/common/lib/format'
import type { BankRasxod } from '@renderer/common/models'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from './constants'
import { bankRasxodPaymentService } from './service'

export const columns: ColumnDef<BankRasxod>[] = [
  {
    fit: true,
    key: 'doc_num',
    header: 'Документ №'
  },
  {
    fit: true,
    key: 'doc_date',
    header: 'Дата проводки',
    renderCell(row, col) {
      return formatLocaleDate(row[col.key as keyof BankRasxod] as string)
    }
  },
  {
    key: 'id_spravochnik_organization',
    header: 'О получателя',
    renderCell(row) {
      return (
        <TooltipCellRenderer
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
    header: 'Сумма',
    renderCell(row) {
      if (!row.tulangan_tulanmagan) {
        return (
          <div className="font-bold leading-tight">
            <span className="align-middle bg-yellow-200 px-0.5">
              {formatNumber(row.tulanmagan_summa)}
            </span>
          </div>
        )
      }
      return <div className="font-bold">{formatNumber(row.summa)}</div>
    }
  },
  {
    fit: true,
    key: 'tulangan_tulanmagan',
    header: 'Туланган',
    renderCell(row) {
      return <BankRasxodStatus row={row} />
    }
  },
  {
    key: 'opisanie',
    header: 'Описания',
    className: 'max-w-md'
  }
]

const BankRasxodStatus = ({ row }: { row: BankRasxod }) => {
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
