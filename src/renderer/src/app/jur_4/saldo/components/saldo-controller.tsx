import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { useRequisitesStore } from '@/common/features/requisites'
import {
  SaldoController,
  type SaldoCreateArgs,
  SaldoNamespace,
  useSaldoController
} from '@/common/features/saldo'
import { useSelectedMonthStore } from '@/common/features/selected-month'

import { PodotchetMonitorQueryKeys } from '../../monitor/config'
import { PodotchetSaldoQueryKeys } from '../config'
import { PodotchetSaldoService } from '../service'

export const PodotchetSaldoController = () => {
  const queryClient = useQueryClient()
  const startDate = useSelectedMonthStore((store) => store.startDate)

  const { budjet_id, main_schet_id, jur4_schet_id } = useRequisitesStore()

  const { dequeueMonth } = useSaldoController({
    ns: SaldoNamespace.JUR_4
  })

  const year = startDate.getFullYear()
  const month = startDate.getMonth() + 1

  const { mutate: autoCreateSaldo, isPending } = useMutation({
    mutationKey: [PodotchetSaldoQueryKeys.auto],
    mutationFn: PodotchetSaldoService.autoCreate,
    onSuccess(res, values) {
      toast.success(res?.message)

      dequeueMonth(values)

      queryClient.invalidateQueries({
        queryKey: [PodotchetSaldoQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [PodotchetMonitorQueryKeys.getAll]
      })
    }
  })

  const handleCreate = ({ month, year, main_schet_id }: SaldoCreateArgs) => {
    autoCreateSaldo({
      month,
      year,
      main_schet_id: main_schet_id!,
      schet_id: jur4_schet_id!
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
