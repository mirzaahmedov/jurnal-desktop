import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { useRequisitesStore } from '@/common/features/requisites'
import { SaldoController, type SaldoCreateArgs } from '@/common/features/saldo'
import { useSelectedMonthStore } from '@/common/features/selected-month'

import { KassaMonitorQueryKeys } from '../../monitor'
import { KassaSaldoQueryKeys } from '../config'
import { KassaSaldoService } from '../service'
import { useKassaSaldo } from './use-saldo'

export const KassaSaldoController = () => {
  const queryClient = useQueryClient()
  const startDate = useSelectedMonthStore((store) => store.startDate)

  const { budjet_id, main_schet_id } = useRequisitesStore()

  const { dequeueMonth } = useKassaSaldo()

  const year = startDate.getFullYear()
  const month = startDate.getMonth() + 1

  const { mutate: createSaldoAuto, isPending } = useMutation({
    mutationKey: [KassaSaldoQueryKeys.auto],
    mutationFn: KassaSaldoService.autoCreate,
    onSuccess(res, values) {
      toast.success(res?.message)

      dequeueMonth(values)

      queryClient.invalidateQueries({
        queryKey: [KassaSaldoQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [KassaMonitorQueryKeys.getAll]
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
