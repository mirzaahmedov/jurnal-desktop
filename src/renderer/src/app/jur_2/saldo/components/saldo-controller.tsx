import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { useRequisitesStore } from '@/common/features/requisites'
import { SaldoController, type SaldoCreateArgs } from '@/common/features/saldo'
import { useSelectedMonthStore } from '@/common/features/selected-month'

import { BankMonitorQueryKeys } from '../../monitor'
import { BankSaldoQueryKeys } from '../config'
import { BankSaldoService } from '../service'
import { useBankSaldo } from './use-saldo'

export const BankSaldoController = () => {
  const queryClient = useQueryClient()
  const startDate = useSelectedMonthStore((store) => store.startDate)

  const { budjet_id, main_schet_id } = useRequisitesStore()

  const { dequeueMonth } = useBankSaldo()

  const year = startDate.getFullYear()
  const month = startDate.getMonth() + 1

  const { mutate: createSaldoAuto, isPending } = useMutation({
    mutationKey: [BankSaldoQueryKeys.auto],
    mutationFn: BankSaldoService.autoCreate,
    onSuccess(res, values) {
      toast.success(res?.message)

      dequeueMonth(values)

      queryClient.invalidateQueries({
        queryKey: [BankSaldoQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [BankMonitorQueryKeys.getAll]
      })
    }
  })

  const handleCreate = ({ month, year, main_schet_id }: SaldoCreateArgs) => {
    createSaldoAuto({
      month,
      year,
      main_schet_id: main_schet_id!
    })
  }

  return (
    <SaldoController
      year={year}
      month={month}
      budjet_id={budjet_id}
      main_schet_id={main_schet_id}
      isCreating={isPending}
      onCreate={handleCreate}
    />
  )
}
