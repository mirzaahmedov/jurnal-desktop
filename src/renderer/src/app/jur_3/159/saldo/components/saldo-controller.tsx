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

import { OrganMonitorQueryKeys } from '../../monitor/config'
import { OrganSaldoQueryKeys } from '../config'
import { OrganSaldoService } from '../service'

export const OrganSaldoController = () => {
  const queryClient = useQueryClient()
  const startDate = useSelectedMonthStore((store) => store.startDate)

  const { budjet_id, main_schet_id, jur3_schet_id } = useRequisitesStore()

  const { dequeueMonth } = useSaldoController({
    ns: SaldoNamespace.JUR_3
  })

  const year = startDate.getFullYear()
  const month = startDate.getMonth() + 1

  const { mutate: autoCreateSaldo, isPending } = useMutation({
    mutationKey: [OrganSaldoQueryKeys.auto],
    mutationFn: OrganSaldoService.autoCreate,
    onSuccess(res, values) {
      toast.success(res?.message)

      dequeueMonth(values)

      queryClient.invalidateQueries({
        queryKey: [OrganSaldoQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [OrganMonitorQueryKeys.getAll]
      })
    }
  })

  const handleCreate = ({ month, year, main_schet_id }: SaldoCreateArgs) => {
    autoCreateSaldo({
      month,
      year,
      main_schet_id: main_schet_id!,
      schet_id: jur3_schet_id!
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
